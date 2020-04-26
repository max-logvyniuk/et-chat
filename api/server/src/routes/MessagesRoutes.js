import { Router } from 'express';

import MessageController from '../controllers/MessageController';

const messagesRouter = Router();

messagesRouter.route('/page')
  .get(MessageController.getPageOfMessages);

messagesRouter.route('/')
  .get(MessageController.getAllMessages)
  .delete(MessageController.deleteAllMessages);
export default messagesRouter;
