import { Router } from 'express';

import UserController from '../controllers/UserController';

const userRouter = Router();

userRouter.route('/')
  .get(UserController.getAllUsers)
  .post(UserController.addUser);

userRouter.route('/:id')
  .get(UserController.getUserById)
  .patch(UserController.updatedUser)
  .delete(UserController.deleteUser);

export default userRouter;
