'use strict';
const express = require('express'),
    errorHandler = require('strong-error-handler'),
    pretty = require('express-prettify'),
    helmet = require('helmet'),
    mongoose = require('mongoose'),
    config = require('./config'),
    routes = require('./routes/quidoRoutes'),
    models = require('./models/quidoModel'),
    app = express(),
    environment = process.env.NODE_ENV || 'development',
    port = process.env.PORT || 3001;

//Set up default mongoose connection
mongoose.Promise = global.Promise;
mongoose.connect(config.mongoDB, { useMongoClient: true });

//Set up middleware
app.use(helmet());
app.use(pretty({ query: 'pretty' }));
app.use(errorHandler({
    debug: environment === 'development',
    log: true,
}));

//Set up routes and start app
routes(app);
app.listen(port);

console.log('quido server started on: ' + port);

