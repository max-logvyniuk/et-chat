import express from 'express';
import socket from 'socket.io';

import MessageService from '../services/MessageService';
import Util from '../utils/Utils';

const util = new Util();

class MessageController {
    constructor(io) {
        this.io = io;
    }

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
        console.log("333333", this.io)
        // console.log(req.body);
        if (!req.body.text || !req.body.user) {
            util.setError(400, 'Please provide complete details');
            return util.send(res);
        }
        const newMessage = req.body;
        try {
            const createdMessage = await MessageService.addMessage(newMessage);
            util.setSuccess(201, 'Message Added!', createdMessage);
            this.io.emit('SERVER:NEW_MESSAGE', createdMessage);
            return util.send(res);

        } catch (error) {
            util.setError(400, error.message);
            return util.send(res);
        }
    };

    updatedMessage = async (req, res) => {
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
            return util.send(res);
        } catch (error) {
            util.setError(404, error);
            return util.send(res);
        }
    };

    getAMessage = async (req, res) => {
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
            return util.send(res);
        } catch (error) {
            util.setError(404, error);
            return util.send(res);
        }
    };

    deleteMessage = async (req, res) => {
        const { id } = req.params;

        if (!Number(id)) {
            util.setError(400, 'Please provide a numeric value');
            return util.send(res);
        }

        try {
            const testToDelete = await MessageService.deleteMessage(id);

            if (testToDelete) {
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