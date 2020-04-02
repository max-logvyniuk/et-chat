import amqp from 'amqplib/callback_api';
import nodemailer from 'nodemailer';

import configJson from '../config/config';

const environment = process.env.NODE_ENV || 'development';
const config = configJson[environment];

// Array of email users. Will use email from users table
const emails = ["maroon4m@gmail.com"];

async function sendEmailMessage(data) {
  // console.info('In mailer', data);
  // Setup Nodemailer transport
  // const testAccount = await nodemailer.createTestAccount();
  const transport = nodemailer.createTransport({
    host: config.hostMailer,
    port: config.portMailer,
    secure: false, // true for 465, false for other ports
    service: "Gmail",
    auth: {
      user: config.emailName,
      pass: config.emailPass
    },

    // Security options to disallow using attachments from file or URL
    disableFileAccess: true,
    disableUrlAccess: true
  }, {
    // Default options for the message. Used if specific values are not set
    from: 'sc.system.vn2020@gmail.com',
    to: 'maroon4m@gmail.com'
  });

  // Create connection to AMQP server
  amqp.connect(config.amqp, function connectCallback(error0, connection) {
   if (error0) {
     console.error('error0', error0.stack);
     return error0;
    }
    // Create channel
    const channelWrapper = connection.createChannel(function createChannelCallback(error1, channel) {
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
        channel.consume(config.queue, getMessageToSend);
      });
    });

    const getMessageToSend = () => {
      console.info('In amqp', data);
      if (data === null) {
        return;
      }
      console.info('In subscriber data', data);
      // Decode message contents
      console.info('In emails', emails);
      // const message = securitySystemMessage.text.toString();
      const message = data.text.toString();

      // Send the message using the previously set up Nodemailer transport
      transport.sendMail({
        from: "sc.system2020@gmail.com", // sender address
        to: emails, // list of receivers
        subject: message, // Subject line
        text: `${message}`, // plain text body
        html: `<b>${message}</b>` // html body
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
    }

  });



}

export default sendEmailMessage;
