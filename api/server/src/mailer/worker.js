import amqp from 'amqplib/callback_api';
import nodemailer from 'nodemailer';
import isEmpty from 'lodash/isEmpty';

import configJson from '../config/config';
import getAllUsersEmail from '../utils/helpers/getAllUsersEmail';

const environment = process.env.NODE_ENV || 'development';
const config = configJson[environment];

const mailStyle = {
  display: "table"
};

const transport = nodemailer.createTransport({
  secure: false,
  service: "Gmail",
  auth: {
    type: 'OAuth2',
    user: config.emailName,
    clientId: config.mailerClientId,
    clientSecret: config.mailerClientSecret,
    refreshToken: config.mailerRefreshToken,
    accessUrl: config.mailerAccessUrl,
    },
  disableFileAccess: true,
  disableUrlAccess: true
}, {
    from: config.emailName,
    to: 'maroon4m@gmail.com'
});

const activateMailingWorker = async () => {
  const emailsFromDatabase = await getAllUsersEmail();
  const emails = process.env.EMAILS_FROM_DB_FOM_MAILER === 'yes'
    ? emailsFromDatabase
    : process.env.GOOGLE_GROUP_EMAIL;
  console.info('User emails', emails);
  amqp.connect(config.amqp, function connectCallback(errorOfConnect, connection) {
    if (errorOfConnect) {
      console.error('errorOfConnect', errorOfConnect.stack);
      return errorOfConnect;
    }
    const channelWrapper = connection.createChannel(
      function createChannelCallback(errorOfCreatingChannel, channel) {
        if (errorOfCreatingChannel) {
          console.error('errorCreateChannel',errorOfCreatingChannel.stack);
          return errorOfCreatingChannel;
        }
        // Ensure queue for messages
        channel.assertQueue(config.queue, {
          // Ensure that the queue is not deleted when server restarts
          durable: true
        }, function assertQueueCallback(errorAssertQueue) {
          if (errorAssertQueue) {
            console.error('errorAssertQueue',errorAssertQueue.stack);
            return errorAssertQueue;
          }
          channel.prefetch(1);
          // eslint-disable-next-line no-use-before-define
          channel.consume(config.queue, getMessageToSend);
        });
      });

    function getMessageToSend(data) {
      if (data === null) {
        return;
      }
      // Decode message contents
      const parseData = JSON.parse(data.content);
      const message = parseData.text.toString();
      const image = parseData.imageAttachment
        ? parseData.imageAttachment.toString()
        : null;
      const title = !isEmpty(process.env.EMAIL_TITLE) ? process.env.EMAIL_TITLE : message;
      const withImage = `<div style={${mailStyle}}>
                            <p>${message}</p>
                            <img src="${image}"/>
                         </div>`;
      const withoutImage = `<div style={${mailStyle}}>
                              <p>${message}</p>
                             </div>`;
      const emailBody = !isEmpty(image) ? withImage : withoutImage;
      transport.sendMail({
        from: process.env.EMAIL_NAME,
        to: emails,
        subject: title,
        text: `${message}`,
        html: emailBody
      }, function processingSendResult(errorOnSendingMail, info) {
           if (errorOnSendingMail) {
             console.error('errorOnSendingMail', errorOnSendingMail.stack);
             // put the failed message item back to queue
             return channelWrapper.nack(data);
           }
           console.info('Delivered message %s', info.messageId);
           // remove message item from the queue
           channelWrapper.ack(data);
      });
    }
  });
};

activateMailingWorker();

