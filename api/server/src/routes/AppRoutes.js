import { Router } from 'express';

import testRouter from './TestRoutes';
import messagesRouter from './MessagesRoutes';
import messageRouter from './MessageRoutes';
import userRouter from './UserRoutes';
import uploadFileRouter from './UploadFileRoutes';

// import multer from '../core/multer';
// import TestController from '../controllers/TestController';
// import MessageController from '../controllers/MessageController';
// import UploadFileController from '../controllers/UploadFileController';
// import UserController from '../controllers/UserController';

const router = Router();

router.use('/test', testRouter);
router.use('/messages', messagesRouter);
router.use('/message', messageRouter);
router.use('/user', userRouter);
router.use('/chat', uploadFileRouter);

// router.route('/test')
//     .get(TestController.getAllTests)
//     .post(TestController.addTest);
//
// router.route('/test/:id')
//     .get(TestController.getATest)
//     .put(TestController.updatedTest)
//     .delete(TestController.deleteTest);

// router.route('/user')
//   .get(UserController.getAllUsers)
//   .post(UserController.addUser);
//
// router.route('/user/:id')
//   .get(UserController.getUserById)
//   .patch(UserController.updatedUser)
//   .delete(UserController.deleteUser);

// router.route('/messages/page')
//   .get(MessageController.getPageOfMessages);
//
// router.route('/messages')
//   .get(MessageController.getAllMessages)
//   .delete(MessageController.deleteAllMessages);
//
// router.route('/message')
//   .post(MessageController.addMessage);
//
// router.route('/message/:id')
//   .get(MessageController.getMessageById)
//   .put(MessageController.updatedMessage)
//   .delete(MessageController.deleteMessage);

// router.route('/chat/file')
//   .post(multer.single('file'), UploadFileController.addUploadFile);
//
// router.route('/chat/file/:id')
//   .delete(UploadFileController.deleteUploadFile);

export default router;
