const express = require('express');

const routes = express.Router();

routes.get('/', function (req, res){
    res.status(200).json({
        "hello": "world"
    });
});

module.exports = routes;