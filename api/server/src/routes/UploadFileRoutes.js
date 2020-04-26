import { Router } from 'express';

import UploadFileController from '../controllers/UploadFileController';
import multer from '../core/multer';

const uploadFileRouter = Router();

uploadFileRouter.route('/file')
  .post(multer.single('file'), UploadFileController.addUploadFile);

uploadFileRouter.route('/file/:id')
  .delete(UploadFileController.deleteUploadFile);

export default uploadFileRouter;
