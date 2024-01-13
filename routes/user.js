const express = require('express');

const route = express.Router();

const userController = require('../controllers/user');
const forgotPasswordControoler = require('../controllers/forgotPassword');
const authentication = require('../middleware/authentication');

route.post('/signup',userController.signupUser);
route.post('/login',userController.loginUser);
route.post('/makeFriend',authentication.authenticate,userController.getPhoneNo)
route.get('/searchUser',authentication.authenticate,userController.searchUsers)
route.get('/getPhoneNo',authentication.authenticate,userController.getPhoneNo)
route.post('/getResetPasswordMail',authentication.authenticate,forgotPasswordControoler.getResetPasswordMail)
route.get('/resetPasswordLink',authentication.authenticate,forgotPasswordControoler.resetPasswordLink)
route.get('/setNewPassword',authentication.authenticate,forgotPasswordControoler.setNewPassword)


module.exports = route;