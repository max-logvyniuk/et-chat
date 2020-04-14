import amqp from 'amqplib/callback_api';
import nodemailer from 'nodemailer';

import configJson from '../config/config';
import getAllUsersEmail from '../utils/helpers/getAllUsersEmail';

const environment = process.env.NODE_ENV || 'development';
const config = configJson[environment];

// Array of email users
// const emails = ["maroon4m@gmail.com"];

const mailStyle = {
  display: "table"
};

  // Setup Nodemailer transport
  // const testAccount = await nodemailer.createTestAccount();
const transport = nodemailer.createTransport({
    // host: config.hostMailer,
    // port: config.portMailer,
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
  const emails = await getAllUsersEmail();
  console.info('User emails', emails);
  // Create connection to AMQP server
  amqp.connect(config.amqp, function connectCallback(error0, connection) {
    if (error0) {
      console.error('error0', error0.stack);
      return error0;
    }
    // Create channel
    const channelWrapper = connection.createChannel(
      function createChannelCallback(error1, channel) {
        console.info('Channes create!!!');
        if (error1) {
          console.error('error1',error1.stack);
          return error1;
        }
        // Ensure queue for messages
        channel.assertQueue(config.queue, {
          // Ensure that the queue is not deleted when server restarts
          durable: true
        }, function assertQueueCallback(error2) {
          if (error2) {
            console.error('error2',error2.stack);
            return error2;
          }

          console.info('channel.assertQueue!', config.queue);
          channel.prefetch(1);

          // eslint-disable-next-line no-use-before-define
          channel.consume(config.queue, function getMessageToSend(data) {
            if (data === null) {
              return;
            }
            // Decode message contents
            console.info('In emails', emails);
            const parseData = JSON.parse(data.content);
            const message = parseData.text.toString();
            const image = parseData.imageAttachment.toString();
            // const message = data.content.toString();
            // const image = data.content.toString();

            // Send the message using the previously set up Nodemailer transport
            transport.sendMail({
              from: "sc.system2020@gmail.com", // sender address
              to: emails, // list of receivers
              subject: message, // Subject line
              text: `${message}`, // plain text body
              html: `<div style={${mailStyle}}>
                       <p>${message}</p>
                       <img src="${image}"/>
                     </div>` // html body
            }, function(error3, info) {
              console.info('Send to email', message);
              if (error3) {
                console.error('error3', error3.stack);
                // put the failed message item back to queue
                return channelWrapper.nack(data);
              }
              console.log('Delivered message %s', info.messageId);
              // remove message item from the queue
              channelWrapper.ack(data);
            });
          });
        });
      });


  });
};

startMailing();

