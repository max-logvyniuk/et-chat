import amqp from 'amqplib/callback_api';

import configJson from '../config/config';

const environment = process.env.NODE_ENV || 'development';
const config = configJson[environment];

async function sendMessageToQueue(data) {

  amqp.connect(config.amqp, function(error0, connection) {
    if (error0) {
      console.error('Errror0', error0);
      throw error0;
    }
    console.info('SendToQ connected1');
    connection.createChannel(function(error1, channel) {
      if (error1) {
        console.error('error1',error1.stack);
        throw error1;
      }
      console.info('SendToQ channel2');
      channel.assertQueue(config.queue, {
        durable: true
      });
      console.info('SendToQ assertQueue 3');
      channel.sendToQueue(config.queue, Buffer.from(JSON.stringify(data)), {
        persistent: true
      });
      console.log(" [x] Sent '%s'", data);
    });
    setTimeout(function() {
      connection.close();

      // process.exit(0)
    }, 500);
  });
}

export default sendMessageToQueue;
