const express = require('express');
const UsersController = require('./controllers/UsersController');
const AuthMiddleware = require('./middlewares/Auth');
const routes = express.Router();

routes.post('/signAuth', UsersController.signAuth);
routes.post('/authenticate', UsersController.authenticate)
routes.post('/addUser', UsersController.addUser);
routes.post('/keys', UsersController.getPEM);
routes.use(AuthMiddleware);
routes.post('/validateSession', UsersController.validateSession);
routes.post('/getUserInfo', UsersController.getUserInfo);
routes.post('/savePublicKey', UsersController.savePublicKey)

module.exports = routes;