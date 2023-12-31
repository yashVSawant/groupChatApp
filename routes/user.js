const express = require('express');

const route = express.Router();

const userController = require('../controllers/user');
const authentication = require('../middleware/authentication');

route.post('/signup',userController.signupUser);
route.post('/login',userController.loginUser);
route.post('/createGroup',authentication.authenticate,userController.createGroup);
route.post('/addUserToGroup',authentication.authenticate,userController.addUserToGroup);
route.get('/getGroups',authentication.authenticate,userController.getGroups);
route.get('/getMembersInGroup',authentication.authenticate,userController.getMembersInGroup)
route.delete('/removeFromGroup',authentication.authenticate,userController.removeMember)
route.put('/makeAdmin',authentication.authenticate,userController.makeAdmin)
route.get('/search',authentication.authenticate,userController.searchUsers)
route.get('/getPhoneNo',authentication.authenticate,userController.getPhoneNo)

module.exports = route;