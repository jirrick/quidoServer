'use strict';
const express = require('express'),
    mongoose = require('mongoose'),
    models = require('./models/quidoModel'),
    errorHandler = require('strong-error-handler'),
    pretty = require('express-prettify'),
    helmet = require('helmet'),
    config = require('./config'),
    Board = require('./class/boardClass'),
    routes = require('./routes/quidoRoutes'),
    app = express(),
    environment = process.env.NODE_ENV || 'development',
    winston = require('winston'),
    port = process.env.PORT || 3001;

//Set up default mongoose connection
mongoose.Promise = global.Promise;
mongoose.connect(config.mongoDB, { useMongoClient: true });

//initialize boards
let _boards = [];
for (let _board of config.boards) {
    _boards.push(new Board(_board));
}
exports.boards = _boards;

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

winston.info('quido server started on: ' + port);

