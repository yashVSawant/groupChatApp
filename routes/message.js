const {Router} = require('express');
const multer = require('multer');

const upload = multer()

const route = Router();

const messageController = require('../controllers/message');
const authentication = require('../middleware/authentication');

route.post('/postMessage',authentication.authenticate,messageController.postMessage);
route.get('/getMessages',authentication.authenticate,messageController.getMessages);
route.post('/postFile',authentication.authenticate,upload.single('file'),messageController.postFile);


module.exports = route;