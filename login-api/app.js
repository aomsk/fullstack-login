var express = require('express');
var cors = require('cors');

var app = express();

// .env
require('dotenv').config()

// set port
var port = process.env.PORT || 3000;

// use cors because of to be able to call api across domains
app.use(cors());

// Config Router
const registerRouter = require('./routes/register');
const loginRouter = require('./routes/login');
const authenRouter = require('./routes/authen');

app.use(registerRouter.router);
app.use(loginRouter.router);
app.use(authenRouter.router);

app.listen(port, function () {
  console.log(`CORS-enabled web server listening on port ${port}`);
});