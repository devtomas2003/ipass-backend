const Sequelize = require('sequelize');
const dbConfig = require('../config/database');

const connection = new Sequelize(dbConfig);

const Utilizadores = require('../models/Utilizadores');
const SignAuths = require('../models/SignAuths');

Utilizadores.init(connection);
SignAuths.init(connection);

module.exports = connection;