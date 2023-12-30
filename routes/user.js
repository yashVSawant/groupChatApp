const express = require('express');

const route = express.Router();

const userController = require('../controllers/user');
const authentication = require('../middleware/authentication');

route.post('/signup',userController.signupUser);
route.post('/login',userController.loginUser);
route.post('/createGroup',authentication.authenticate,userController.createGroup);

module.exports = route;