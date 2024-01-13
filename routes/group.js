const express = require('express');

const route = express.Router();

const groupController = require('../controllers/groups');
const authentication = require('../middleware/authentication');

route.post('/createGroup',authentication.authenticate,groupController.createGroup);
route.post('/inviteUserInGroup',authentication.authenticate,groupController.inviteUserInGroup);
route.get('/getGroups',authentication.authenticate,groupController.getGroups);
route.get('/getMembersInGroup',authentication.authenticate,groupController.getMembersInGroup)
route.get('/search',authentication.authenticate,groupController.search)
route.put('/makeAdmin',authentication.authenticate,groupController.makeAdmin)
route.delete('/removeFromGroup',authentication.authenticate,groupController.removeMember)
route.delete('/exitFromGroup',authentication.authenticate,groupController.exitFromGroup)
route.get('/getRequests',authentication.authenticate,groupController.getRequests)
route.post('/acceptRequest',authentication.authenticate,groupController.acceptRequest)

module.exports = route;