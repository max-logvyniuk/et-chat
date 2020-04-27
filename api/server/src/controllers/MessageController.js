import isEmpty from 'lodash/isEmpty';
import paginate from 'jw-paginate';
import get from 'lodash/get';

import MessageService from '../services/MessageService';
import Util from '../utils/Utils';
import sendMessageToQueue from '../mailer/sendMessageToQueue';
import configJson from "../config/config";
import UploadFileController from './UploadFileController';

const environment = process.env.NODE_ENV || 'development';
const config = configJson[environment];

const util = new Util();

class MessageController {

     static async getPageOfMessages(request, response) {
       const io = request.app.get('socketio');
       const currentPage = request.query.page || 1;
       console.info('REQUEST page#!!!!', request.query);
       try {
          if (Number(currentPage) === 1 || isEmpty(currentPage)) {
            const updatedMessages = await MessageService.updateMessagesStatus();
            console.info('IN PAGE updatedMessages!!!!!', updatedMessages);
            io.emit('SERVER:UPDATE_READ_STATUS');
          }
          // const messagesArray = await MessageService.getPageOfMessages();
          // const allMessages = messagesArray.reverse();
          const allMessages = await MessageService.getPageOfMessages();
          // console.info('All messages ---', allMessages);
          const page = parseInt(currentPage, 10) || 1;
          // console.info('PAGE!', page);
          const pageSize = Number(process.env.PAGE_SIZE);
          const pager = paginate(allMessages.length, page, pageSize);

          // const pageOfMessages = allMessages.slice(pager.startIndex, pager.endIndex + 1);
          const pageOfMessages = allMessages.slice(pager.startIndex, pager.endIndex + 1);

          pageOfMessages.reverse();

          const messagePageToSend = { pager, pageOfMessages};
          // console.info('Page of messages', messagePageToSend);

          if (allMessages.length > 0) {
             util.setSuccess(200, 'Messages retrieved', messagePageToSend);
          } else {
             util.setSuccess(200, 'No messages found');
          }
          return util.send(response);
       } catch (error) {
         console.log(error);
         util.setError(500, error);
         return util.send(response);
       }
     };

    static async getAllMessages(request, response) {
        const io = request.app.get('socketio');
        try {
            const updatedMessages = await MessageService.updateMessagesStatus();
            console.info('updatedMessages!!!!!', updatedMessages);
            const allMessages = await MessageService.getAllMessages();
            // console.info('All messages ---', allMessages);
            if (allMessages.length > 0) {
                util.setSuccess(200, 'Messages retrieved', allMessages);
            } else {
                util.setSuccess(200, 'No messages found');
            }
          io.emit('SERVER:UPDATE_READ_STATUS');
          return util.send(response);
        } catch (error) {
          console.log(error);
            util.setError(500, error);
            return util.send(response);
        }
    };

    static async addMessage(request, response) {
        const io = request.app.get('socketio');
        // console.info('In new message', request.body);

        if (
          !request.body.UserId &&
          isEmpty(request.body.text) &&
          isEmpty(request.body.UploadFileId)
        ) {
            util.setError(400, 'Please provide complete details');
            return util.send(response);
        }

        if (request.headers.lastmessage) {
          const lastMessageId = request.headers.lastmessage || 1;
          const lastMessageUser = await MessageService.getAMessage(lastMessageId);
          console.info('!!!!!!lastMessage', lastMessageId, lastMessageUser.UserId, request.body.UserId);
          if (get(lastMessageUser, 'UserId', '1') !== request.body.UserId) {
            console.info('Update status++++');
            await MessageService.updateMessagesStatus();
            // if (!request.body.UploadFileId) {
            //   io.emit('SERVER:UPDATE_READ_STATUS')
            // }
            io.emit('SERVER:UPDATE_READ_STATUS')
          }
        }

        const newMessage = request.body;
        // Send data to mailer
        console.info('Mailer active', typeof newMessage.UserId, typeof config.serverUserId);
        if(newMessage.UserId === `${config.serverUserId}`) {
          console.info('Mailer active', newMessage.UserId, config.serverUserId);
          try {
            await sendMessageToQueue(newMessage);
          }
          catch (error) {
            console.info(error);
            util.setError(500, error.message);
            return util.send(response);
          }
        }
        try {
            const createdMessage = await MessageService.addMessage(newMessage);
//          console.info('Id updated File', request.body.UploadFileId);
          if (request.body.UploadFileId) {
            const newMessageId = createdMessage.id;
            const id = request.body.UploadFileId;
            await UploadFileController.updateUploadFile(id, newMessageId);
            const createdMessageWithUploadFile = await MessageService.getAMessage(newMessageId);
            util.setSuccess(201, 'Message Added!', createdMessage);
            // console.info('New message', createdMessage.id);
            io.emit('SERVER:NEW_MESSAGE', createdMessageWithUploadFile);
            // io.emit('SERVER:UPDATE_READ_STATUS');

            return util.send(response);
          }
            util.setSuccess(201, 'Message Added!', createdMessage);
            // console.info('New message', createdMessage.id);
            io.emit('SERVER:NEW_MESSAGE', createdMessage);

            return util.send(response);

        } catch (error) {
          console.info(error);
            util.setError(500, error.message);
            return util.send(response);
        }
    };

    static async updatedMessage(request, response) {
        const io = request.app.get('socketio');
        const alteredMessage = request.body;
        const { id } = request.params;

        // console.info('alteredMessage!', alteredMessage);
        // console.info('Id', id);
        if (!Number(id)) {
            util.setError(400, 'Please input a valid numeric value');
            return util.send(response);
        }
        try {
            const updateMessage = await MessageService.updateMessage(id, alteredMessage);
            if (!updateMessage) {
                util.setError(404, `Cannot find test with the id: ${id}`);
            } else {
                util.setSuccess(200, 'Message updated', updateMessage);
            }
            io.emit('SERVER:UPDATE_MESSAGE', updateMessage);
            return util.send(response);
        } catch (error) {
            util.setError(500, error);
            return util.send(response);
        }
    };

    static async getMessageById(request, response) {
        // console.log(request);

      const io = request.app.get('socketio');
        const { id } = request.params;

        if (!Number(id)) {
            util.setError(400, 'Please input a valid numeric value');
            return util.send(response);
        }

        try {
            const theMessage = await MessageService.getAMessage(id);

            if (!theMessage) {
                util.setError(404, `Cannot find test with the id ${id}`);
            } else {
                util.setSuccess(200, 'Found Message', theMessage);
            }
            io.emit('SERVER:NEW_MESSAGE', theMessage);
            return util.send(response);
        } catch (error) {
            util.setError(500, error);
            return util.send(response);
        }
    };

    static async deleteMessage(request, response) {
        const io = request.app.get('socketio');
        const { id } = request.params;

        if (!Number(id)) {
            util.setError(400, 'Please provide a numeric value');
            return util.send(response);
        }

        try {
            const messageToDelete = await MessageService.deleteMessage(id);
            // io.emit('SERVER:REMOVE_MESSAGE', id);
            if (messageToDelete) {
                util.setSuccess(200, 'Message deleted');
            } else {
                util.setError(404, `Message with the id ${id} cannot be found`);
            }
            // console.info('Delete IO', io.emit('SERVER:REMOVE_MESSAGE', id));
            io.emit('SERVER:REMOVE_MESSAGE', id);
            return util.send(response);
        } catch (error) {
            util.setError(500, error);
            return util.send(response);
        }
    }

    static async deleteAllMessages(request, response) {
      // console.info('deleteAllMessages', request);
      const io = request.app.get('socketio');

      try {
        await UploadFileController.deleteAllUploadFiles();
        const deleteSuccess = await MessageService.deleteAllMessages();
        console.info('deleteAllMessages', deleteSuccess);
        if (deleteSuccess) {
          util.setSuccess(200, 'Messages deleted');
        } else {
          util.setError(404, `Messages cannot be deleted`);
        }
        // console.info('Delete IO', io.emit('SERVER:REMOVE_MESSAGE', id));
        io.emit('SERVER:REMOVE_MESSAGE', deleteSuccess);
        return util.send(response);
      } catch (error) {
        console.info('deleteAllMessages ERROR', error);
        util.setError(500, error);
        return util.send(response);
      }
    }
}


export default MessageController;
