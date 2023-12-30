const {Router} = require('express');

const route = Router();

const messageController = require('../controllers/message');
const authentication = require('../middleware/authentication');

route.post('/postMessage',authentication.authenticate,messageController.postMessage);
route.get('/getMessages',authentication.authenticate,messageController.getMessages);
route.get('/getGroups',authentication.authenticate,messageController.getGroups)

module.exports = route;