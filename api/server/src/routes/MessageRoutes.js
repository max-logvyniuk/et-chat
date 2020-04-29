import { Router } from 'express';

import MessageController from '../controllers/MessageController';

const messageRouter = Router();

messageRouter.route('/')
  .post(MessageController.addMessage);

messageRouter.route('/:id')
  .get(MessageController.getMessageById)
  .put(MessageController.updatedMessage)
  .delete(MessageController.deleteMessage);

export default messageRouter;
