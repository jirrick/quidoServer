'use strict';
const express = require('express'),
    mongoose = require('mongoose'),
    models = require('./models/quidoModel'),
    errorHandler = require('strong-error-handler'),
    pretty = require('express-prettify'),
    helmet = require('helmet'),
    config = require('./config'),
    boardClasses = require('./class/boardClasses'),
    routes = require('./routes/quidoRoutes'),
    app = express(),
    environment = process.env.NODE_ENV || 'development',
    port = process.env.PORT || 3001;

//Set up default mongoose connection
mongoose.Promise = global.Promise;
mongoose.connect(config.mongoDB, { useMongoClient: true });

//initialize boards
let _boards = [];
let _board = null;
for (_board of config.boards) {
    _boards.push(new boardClasses.Board(_board));
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

console.log('quido server started on: ' + port);

