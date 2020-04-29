import { Router } from 'express';

import testRouter from './TestRoutes';
import messagesRouter from './MessagesRoutes';
import messageRouter from './MessageRoutes';
import userRouter from './UserRoutes';
import uploadFileRouter from './UploadFileRoutes';

const router = Router();

router.use('/test', testRouter);
router.use('/messages', messagesRouter);
router.use('/message', messageRouter);
router.use('/user', userRouter);
router.use('/chat', uploadFileRouter);

export default router;
