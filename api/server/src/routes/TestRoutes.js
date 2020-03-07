import { Router } from 'express';
import TestController from '../controllers/TestController';

const router = Router();

router.route('/')
    .get(TestController.getAllTests)
    .post(TestController.addTest);

router.route('/:id')
    .get(TestController.getATest)
    .put(TestController.updatedTest)
    .delete(TestController.deleteTest);

export default router;