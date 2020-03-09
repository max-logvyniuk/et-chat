import { Router } from 'express';
import express from 'express';
import bodyParser from "body-parser";

import TestController from '../controllers/TestController';
import {
    MessageCtrl
} from "../controllers";

const routerExpress = Router();

const router = (app, io) => {


    const MessageControllerIO = new MessageCtrl(io)

    // console.log(MessageCtrl)
    // console.log(MessageControllerIO)

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));

    /**
     routerExpress.route('/test')
     .get(TestController.getAllTests)
     .post(TestController.addTest);

     routerExpress.route('/test/:id')
     .get(TestController.getATest)
     .put(TestController.updatedTest)
     .delete(TestController.deleteTest);

     routerExpress.route('/message')
     .get(MessageControllerIO.getAllMessages)
     .post(MessageControllerIO.addMessage);

     routerExpress.route('message/:id')
     .get(MessageControllerIO.getAMessage)
     .put(MessageControllerIO.updatedMessage)
     .delete(MessageControllerIO.deleteMessage);
     **/

    app.get(('/api/message'), MessageControllerIO.getAllMessages)
    app.post(('/api/message'), MessageControllerIO.addMessage);

    app.get(('/api/message/:id'), MessageControllerIO.getAMessage)
    app.put(('/api/message/:id'), MessageControllerIO.updatedMessage)
    app.delete(('/api/message/:id'), MessageControllerIO.deleteMessage);

}

export default router;


/**
import { Router } from 'express';
import express from 'express';
import bodyParser from "body-parser";

import TestController from '../controllers/TestController';

import {
    MessageCtrl
} from "../controllers";

//Треба зробити, щоб ioObj спочатку отримував іо, а потім передавався в new MessageCtrl(io)
let ioObj = {};

export const messageControllersWithIO = (io) => {

    if(io !== undefined){
        console.log("11111111111111", io)
        ioObj = io;
        console.log("222222222", ioObj)
        return ioObj
    }
    return messageControllersWithIO
//Як отримати io із функції і передати в new MessageCtrl(io)
}

messageControllersWithIO();

// console.log("555555555", ioObj)

const io = ioObj;

console.log(io)

// const io = ioObj;

const MessageControllerIO = new MessageCtrl(io);

// console.log(MessageControllerIO)

const routerExpress = Router();


     routerExpress.route('/test')
     .get(TestController.getAllTests)
     .post(TestController.addTest);

     routerExpress.route('/test/:id')
     .get(TestController.getATest)
     .put(TestController.updatedTest)
     .delete(TestController.deleteTest);

     routerExpress.route('/message')
     .get(MessageControllerIO.getAllMessages)
     .post(MessageControllerIO.addMessage);

     routerExpress.route('message/:id')
     .get(MessageControllerIO.getAMessage)
     .put(MessageControllerIO.updatedMessage)
     .delete(MessageControllerIO.deleteMessage);


export default routerExpress;
**/

