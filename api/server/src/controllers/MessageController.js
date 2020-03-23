// import express from 'express';

import MessageService from '../services/MessageService';
import Util from '../utils/Utils';

const util = new Util();

class MessageController {

    static async getAllMessages(request, response) {
        try {
            const allMessages = await MessageService.getAllMessages();
            // console.info('All messages ---', allMessages);
            if (allMessages.length > 0) {
                util.setSuccess(200, 'Messages retrieved', allMessages);
            } else {
                util.setSuccess(200, 'No messages found');
            }
          return util.send(response);
        } catch (error) {
          console.log(error);
            util.setError(400, error);
            return util.send(response);
        }
    };

    static async addMessage(request, response) {
        const io = request.app.get('socketio');
        // console.log('1111111111111111', io)
      // console.log('Data from fetch', request.body)
        if (!request.body.text
        //  || !request.body.user
        ) {
            util.setError(400, 'Please provide complete details');
            return util.send(response);
        }
        const newMessage = request.body;
        try {
            const createdMessage = await MessageService.addMessage(newMessage);
            util.setSuccess(201, 'Message Added!', createdMessage);
            io.emit('SERVER:NEW_MESSAGE', createdMessage);
            return util.send(response);

        } catch (error) {
            util.setError(400, error.message);
            return util.send(response);
        }
    };

    static async updatedMessage(request, response) {
        const io = request.app.get('socketio');
        const alteredMessage = request.body;
        const { id } = request.params;

        console.info('Neeeeeeeeeew', alteredMessage);
        // console.info('upppppppppppppppp', id);
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
            util.setError(404, error);
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
            util.setError(404, error);
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

            io.emit('SERVER:REMOVE_MESSAGE', id);
            if (messageToDelete) {
                util.setSuccess(200, 'Message deleted');
            } else {
                util.setError(404, `Message with the id ${id} cannot be found`);
            }
            return util.send(response);
        } catch (error) {
            util.setError(400, error);
            return util.send(response);
        }
    }
}


export default MessageController;
