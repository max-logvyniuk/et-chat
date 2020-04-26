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
    secure: false, // true for 465, false for other ports
    service: "Gmail",
    auth: {
      type: 'OAuth2',
      user: config.emailName,
      clientId: config.mailerClientId,
      clientSecret: config.mailerClientSecret,
      refreshToken: config.mailerRefreshToken,
      // accessToken: config.mailerAccessToken,
      // expires: 1569348590870 + 600000,
      // pass: config.emailPass,
      accessUrl: config.mailerAccessUrl,
    },

    // Security options to disallow using attachments from file or URL
    disableFileAccess: true,
    disableUrlAccess: true
  }, {
    // Default options for the message. Used if specific values are not set
    from: config.emailName,
    to: 'maroon4m@gmail.com'
});

const startMailing = async () => {
  const emailsFromDatabase = await getAllUsersEmail();
  const emails = process.env.EMAILS_FROM_DB_FOM_MAILER === 'yes'
    ? emailsFromDatabase
    :'security-chat@googlegroups.com';
  console.info('User emails', emails);
  // Create connection to AMQP server
  amqp.connect(config.amqp, function connectCallback(errorOfConnect, connection) {
    if (errorOfConnect) {
      console.error('errorOfConnect', errorOfConnect.stack);
      return errorOfConnect;
    }
    // Create channel
    const channelWrapper = connection.createChannel(
      function createChannelCallback(errorOfCreatingChannel, channel) {
        console.info('Channel create!!!');
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
          console.info('channel.assertQueue!', config.queue);
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
      console.info('In emails', emails);
      const parseData = JSON.parse(data.content);
      const message = parseData.text.toString();
      const image = parseData.imageAttachment
        ? parseData.imageAttachment.toString()
        : null;
      console.info('Image in parseData', image);
      const withImage = `<div style={${mailStyle}}>
                                 <p>${message}</p>
                                 <img src="${image}"/>
                               </div>`;
      const withoutImage = `<div style={${mailStyle}}>
                                    <p>${message}</p>
                                  </div>`;
      const emailBody = !isEmpty(image) ? withImage : withoutImage;
      // Send the message using the previously set up Nodemailer transport
      transport.sendMail({
        from: "sc.system2020@gmail.com", // sender address
        to: emails, // list of receivers
        subject: message, // Subject line
        text: `${message}`, // plain text body
        html: emailBody // html body
      }, function(errorOnSendingMail, info) {
        console.info('Send to email', message);
        if (errorOnSendingMail) {
          console.error('errorOnSendingMail', errorOnSendingMail.stack);
          // put the failed message item back to queue
          return channelWrapper.nack(data);
        }
        console.log('Delivered message %s', info.messageId);
        // remove message item from the queue
        channelWrapper.ack(data);
      });
    }
  });
};

startMailing();

