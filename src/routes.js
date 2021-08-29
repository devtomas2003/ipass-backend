const express = require('express');
const UsersController = require('./controllers/UsersController');
const routes = express.Router();

routes.post('/signAuth', UsersController.signAuth);
routes.post('/authenticate', UsersController.authenticate)
routes.post('/addUser', UsersController.addUser);
routes.post('/keys', UsersController.getPEM);

module.exports = routes;