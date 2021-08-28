const express = require('express');
const UsersController = require('./controllers/UsersController');
const routes = express.Router();

routes.post('/signAuthenticate', UsersController.signAuthenticate);
routes.post('/authenticate', UsersController.authenticate)
routes.post('/addUser', UsersController.addUser);
routes.post('/keys', UsersController.getPEM);

module.exports = routes;