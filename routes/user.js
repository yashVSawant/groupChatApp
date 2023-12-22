const express = require('express');

const route = express.Router();

const userController = require('../controllers/user')

route.post('/signup',userController.getUsers);

module.exports = route;