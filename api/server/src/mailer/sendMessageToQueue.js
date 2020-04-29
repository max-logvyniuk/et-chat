import amqp from 'amqplib/callback_api';

import configJson from '../config/config';

const environment = process.env.NODE_ENV || 'development';
const config = configJson[environment];

async function sendMessageToQueue(data) {

  amqp.connect(config.amqp, function connectToQueue(errorConnectToQueue, connection) {
    if (errorConnectToQueue) {
      console.error('errorConnectToQueue', errorConnectToQueue);
      throw errorConnectToQueue;
    }
    connection.createChannel(function createChannel(errorCreateChannel, channel) {
      if (errorCreateChannel) {
        console.error('errorCreateChannel',errorCreateChannel.stack);
        throw errorCreateChannel;
      }
      channel.assertQueue(config.queue, {
        durable: true
      });
      channel.sendToQueue(config.queue, Buffer.from(JSON.stringify(data)), {
        persistent: true
      });
      console.info(" [x] Sent '%s'", data);
    });
    setTimeout(function closeConnection() {
      connection.close();
    }, 500);
  });
}

export default sendMessageToQueue;
