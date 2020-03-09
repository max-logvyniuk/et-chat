// import express from 'express';

import MessageService from '../services/MessageService';
import Util from '../utils/Utils';

const util = new Util();

class MessageController {
    // constructor() {
    //
    // }

    getAllMessages = async(req, res) => {
        try {
            const allMessages = await MessageService.getAllMessages();
            if (allMessages.length > 0) {
                util.setSuccess(200, 'Messages retrieved', allMessages);
            } else {
                util.setSuccess(200, 'No test found');
            }
            return util.send(res);
        } catch (error) {
            util.setError(400, error);
            return util.send(res);
        }
    };

    addMessage = async (req, res) => {
        const io = req.app.get('socketio')
        console.log(io)

        // console.log(req.body);
        if (!req.body.text || !req.body.user) {
            util.setError(400, 'Please provide complete details');
            return util.send(res);
        }
        const newMessage = req.body;
        try {
            const createdMessage = await MessageService.addMessage(newMessage);
            util.setSuccess(201, 'Message Added!', createdMessage);
            io.emit('SERVER:NEW_MESSAGE', createdMessage);
            return util.send(res);

        } catch (error) {
            util.setError(400, error.message);
            return util.send(res);
        }
    };

    updatedMessage = async (req, res) => {
        const io = req.app.get('socketio')
        const alteredMessage = req.body;
        const { id } = req.params;
        if (!Number(id)) {
            util.setError(400, 'Please input a valid numeric value');
            return util.send(res);
        }
        try {
            const updateMessage = await MessageService.updateMessage(id, alteredMessage);
            if (!updateMessage) {
                util.setError(404, `Cannot find test with the id: ${id}`);
            } else {
                util.setSuccess(200, 'Message updated', updateMessage);
            }
            io.emit('SERVER:NEW_MESSAGE', updateMessage);
            return util.send(res);
        } catch (error) {
            util.setError(404, error);
            return util.send(res);
        }
    };

    getAMessage = async (req, res) => {
        const io = req.app.get('socketio');
        const { id } = req.params;

        if (!Number(id)) {
            util.setError(400, 'Please input a valid numeric value');
            return util.send(res);
        }

        try {
            const theMessage = await MessageService.getAMessage(id);

            if (!theMessage) {
                util.setError(404, `Cannot find test with the id ${id}`);
            } else {
                util.setSuccess(200, 'Found Message', theMessage);
            }
            io.emit('SERVER:NEW_MESSAGE', theMessage);
            return util.send(res);
        } catch (error) {
            util.setError(404, error);
            return util.send(res);
        }
    };

    deleteMessage = async (req, res) => {
        const io = req.app.get('socketio');
        const { id } = req.params;

        if (!Number(id)) {
            util.setError(400, 'Please provide a numeric value');
            return util.send(res);
        }

        try {
            const messageToDelete = await MessageService.deleteMessage(id);

            //How to use socket in delete controller?
            // io.emit('SERVER:NEW_MESSAGE', id);
            if (messageToDelete) {
                util.setSuccess(200, 'Message deleted');
            } else {
                util.setError(404, `Message with the id ${id} cannot be found`);
            }
            return util.send(res);
        } catch (error) {
            util.setError(400, error);
            return util.send(res);
        }
    }
}


export default MessageController;