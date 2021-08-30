const express = require('express');
const routes = require('./routes');
require('./database');
require('dotenv').config();
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(cors());
app.use(routes);

app.listen(8080);