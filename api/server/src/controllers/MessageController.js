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
    try {
      if (Number(currentPage) === 1 || isEmpty(currentPage)) {
        await MessageService.updateMessagesStatus();
        io.emit('SERVER:UPDATE_READ_STATUS');
      }
      const allMessages = await MessageService.getPageOfMessages();
      const page = parseInt(currentPage, 10) || 1;
      const pageSize = Number(process.env.PAGE_SIZE);
      const pager = paginate(allMessages.length, page, pageSize);
      const pageOfMessages = allMessages.slice(pager.startIndex, pager.endIndex + 1);
      pageOfMessages.reverse();
      const messagePageToSend = { pager, pageOfMessages};

      if (allMessages.length > 0) {
         util.setSuccess(200, 'Messages retrieved', messagePageToSend);
      } else {
         util.setSuccess(200, 'No messages found');
      }
      return util.send(response);
    } catch (error) {
      util.setError(500, error);
      return util.send(response);
      }
  };

  static async getAllMessages(request, response) {
    const io = request.app.get('socketio');
    try {
      await MessageService.updateMessagesStatus();
        const allMessages = await MessageService.getAllMessages();
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
      if (get(lastMessageUser, 'UserId', '1') !== request.body.UserId) {
        await MessageService.updateMessagesStatus();
        io.emit('SERVER:UPDATE_READ_STATUS')
      }
    }

    const newMessage = request.body;

    if(newMessage.UserId === `${config.serverUserId}`) {
      try {
        await sendMessageToQueue(newMessage);
      }
      catch (error) {
        util.setError(500, error.message);
        return util.send(response);
      }
    }
    try {
      const createdMessage = await MessageService.addMessage(newMessage);
      if (request.body.UploadFileId) {
        const newMessageId = createdMessage.id;
        const id = request.body.UploadFileId;
        await UploadFileController.updateUploadFile(id, newMessageId);
        const createdMessageWithUploadFile = await MessageService.getAMessage(newMessageId);
        util.setSuccess(201, 'Message Added!', createdMessage);
        io.emit('SERVER:NEW_MESSAGE', createdMessageWithUploadFile);

        return util.send(response);
      }
        util.setSuccess(201, 'Message Added!', createdMessage);
        io.emit('SERVER:NEW_MESSAGE', createdMessage);

        return util.send(response);

      } catch (error) {
        util.setError(500, error.message);
        return util.send(response);
      }
  };

  static async updatedMessage(request, response) {
    const io = request.app.get('socketio');
    const alteredMessage = request.body;
    const { id } = request.params;

    if (!Number(id)) {
       util.setError(400, 'Please input a valid numeric value');
       return util.send(response);
    }
    try {
      const updateMessage = await MessageService.updateMessage(id, alteredMessage);
      if (!updateMessage) {
        util.setError(404, `Cannot find message with the id: ${id}`);
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
    const { id } = request.params;

    if (!Number(id)) {
      util.setError(400, 'Please input a valid numeric value');
      return util.send(response);
    }

    try {
      const theMessage = await MessageService.getAMessage(id);

      if (!theMessage) {
        util.setError(404, `Cannot find message with the id ${id}`);
      } else {
        util.setSuccess(200, 'Found Message', theMessage);
      }
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
      if (messageToDelete) {
        util.setSuccess(200, 'Message deleted');
      } else {
        util.setError(404, `Message with the id ${id} cannot be found`);
      }
      io.emit('SERVER:REMOVE_MESSAGE', id);
      return util.send(response);
    } catch (error) {
     util.setError(500, error);
     return util.send(response);
    }
  }

  static async deleteAllMessages(request, response) {
    const io = request.app.get('socketio');

    try {
      await UploadFileController.deleteAllUploadFiles();
      const deleteSuccess = await MessageService.deleteAllMessages();
      if (deleteSuccess) {
        util.setSuccess(200, 'Messages deleted');
      } else {
        util.setError(404, `Messages cannot be deleted`);
      }
      io.emit('SERVER:REMOVE_MESSAGE', deleteSuccess);
      return util.send(response);
    } catch (error) {
      util.setError(500, error);
      return util.send(response);
    }
  }
}

export default MessageController;
