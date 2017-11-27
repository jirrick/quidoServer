'use strict';
const express = require('express'),
    mongoose = require('mongoose'),
    quidoModels = require('./models/quidoModels'),
    logger = require('./logger'),
    errorHandler = require('strong-error-handler'),
    pretty = require('express-prettify'),
    helmet = require('helmet'),
    bodyParser = require('body-parser'),
    routes = require('./routes/quidoRoutes'),
    app = express(),
    environment = process.env.NODE_ENV || 'development',
    port = process.env.PORT || 3001,
    mongoDB = process.env.MongoDB_CONN;

//Set up default mongoose connection
mongoose.Promise = global.Promise;
mongoose.connect(mongoDB, { useMongoClient: true });

//Set up middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(helmet());
app.use(pretty({ query: 'pretty' }));
app.use(errorHandler({
    debug: environment === 'development',
    log: true,
}));

//Set up routes and start app
routes(app);
app.listen(port);

logger.info('quido server started on: ' + port);

