const express = require('express');

const route = express.Router();

const userController = require('../controllers/user')

route.post('/signup',userController.signupUser);
route.post('/login',userController.loginUser);

module.exports = route;