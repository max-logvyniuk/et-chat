import { Router } from 'express';
import TestController from '../controllers/TestController';
import MessageController from "../controllers/MessageController";

const router = Router();

router.route('/test')
    .get(TestController.getAllTests)
    .post(TestController.addTest);

router.route('test/:id')
    .get(TestController.getATest)
    .put(TestController.updatedTest)
    .delete(TestController.deleteTest);

router.route('/messages')
  .get(MessageController.getAllMessages);

router.route('/message')
  .post(MessageController.addMessage);

router.route('/message/:id')
  .get(MessageController.getMessageById)
  .put(MessageController.updatedMessage)
  .delete(MessageController.deleteMessage);

export default router;
