'use strict';
const express = require('express'),
    pretty = require('express-prettify'),
    helmet = require('helmet'),
    mongoose = require('mongoose'),
    config = require('./config'),
    routes = require('./routes/quidoRoutes'),
    models= require('./models/quidoModel'),
    app = express(),
    port = process.env.PORT || 3001;

//Set up default mongoose connection
mongoose.Promise = global.Promise;
mongoose.connect(config.mongoDB, {useMongoClient: true});

//Set up Helmet & Prettify
app.use(helmet());
app.use(pretty({ query: 'pretty' }));

//Set up routes and start app
routes(app);
app.listen(port);

console.log('quido server started on: ' + port);

