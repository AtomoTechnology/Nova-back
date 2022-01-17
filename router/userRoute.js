const express = require('express');
const authController = require('./../controllers/authController');
const userController = require('./../controllers/userController');
const usersRouter = express.Router();

usersRouter.post('/signup', authController.signUp);
usersRouter.post('/signin', authController.signIn);
usersRouter.post('/forgotPassword', authController.forgotPassword);
usersRouter.patch('/resetPassword/:token', authController.resetPassword);

usersRouter.get('/updatePasswordFormerUsers', userController.updatePasswordFormerUser);

usersRouter.use(authController.protect);

usersRouter.post('/renewToken', authController.renewToken);
usersRouter.patch('/updateMyPassword', authController.updatePassword);
usersRouter.patch('/updateMe', userController.updateMe);

usersRouter.get(
  '/me',
  authController.restrictTo('user'),
  userController.GetMe,
  userController.getUser
);
usersRouter.delete('/deleteMe', authController.restrictTo('user'), userController.deleteMe);

usersRouter
  .route('/')
  .get(authController.restrictTo('admin', 'tecnico'), userController.getAllUsers);
usersRouter
  .route('/:id')
  .get(userController.getUser)
  .delete(authController.restrictTo('admin'), userController.deleteUser); //.patch(updateUser);

module.exports = usersRouter;
