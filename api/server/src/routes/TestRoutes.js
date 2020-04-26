import { Router } from 'express';

import TestController from '../controllers/TestController';

const testRouter = Router();

testRouter.route('/')
  .get(TestController.getAllTests)
  .post(TestController.addTest);

testRouter.route('/:id')
  .get(TestController.getATest)
  .put(TestController.updatedTest)
  .delete(TestController.deleteTest);

export default testRouter;
