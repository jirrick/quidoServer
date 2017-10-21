'use strict';
const express = require('express'),
    mongoose = require('mongoose'),
    modelsInit = require('./models/quidoInit'),
    errorHandler = require('strong-error-handler'),
    pretty = require('express-prettify'),
    helmet = require('helmet'),
    bodyParser = require('body-parser'),
    config = require('./config'),
    routes = require('./routes/quidoRoutes'),
    winston = require('winston'),
    app = express(),
    environment = process.env.NODE_ENV || 'development',
    logLevel = process.env.CONSOLE_LEVEL || 'debug',
    port = process.env.PORT || 3001;

//Set up default mongoose connection
mongoose.Promise = global.Promise;
mongoose.connect(config.mongoDB, { useMongoClient: true });

//set up logger
const logTimeFormat = () => (new Date()).toLocaleTimeString(),
    logger = new (winston.Logger)({
        transports: [
            new (winston.transports.Console)({
                timestamp: logTimeFormat,
                level: logLevel
            })
        ]
    });
exports.logger = logger;

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

