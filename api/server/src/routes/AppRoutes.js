import { Router } from 'express';

import multer from '../core/multer';
import TestController from '../controllers/TestController';
import MessageController from '../controllers/MessageController';
import UploadFileController from '../controllers/UploadFileController';

const router = Router();

router.route('/test')
    .get(TestController.getAllTests)
    .post(TestController.addTest);

router.route('/test/:id')
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

router.route('/chat/file')
  .post(multer.single('file'), UploadFileController.addUploadFile);

router.route('/chat/file/:id')
  .delete(UploadFileController.deleteUploadFile);

export default router;
