'use strict';
const express = require('express'),
    helmet = require('helmet'),
    mongoose = require('mongoose'),
    config = require('./config'),
    bodyParser = require('body-parser'),
    routes = require('./routes/quidoRoutes'),
    models= require('./models/quidoModel'),
    app = express(),
    port = process.env.PORT || 3001;

//Set up default mongoose connection
mongoose.Promise = global.Promise;
mongoose.connect(config.mongoDB, {useMongoClient: true});

//Set up Helmet
app.use(helmet());

//Set up body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Set up routes and start app
routes(app);
app.listen(port);

console.log('quido server started on: ' + port);

