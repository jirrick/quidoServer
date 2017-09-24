'use strict';

const appController = require('../controllers/appController'),
    boardController = require('../controllers/boardController'),
    viewController = require('../controllers/viewController');

module.exports = function (app) {
    app.route('/')
        .get(appController.main);

    app.route('/listen')
        .get(boardController.parse);

    app.route('/output/:name')
        .get(boardController.getValue);

    app.route('/output/:name/:value')
        .get(boardController.setValue);

    app.route('/view/:limit?')
        .get(viewController.jsonAll);

    app.route('/temps/:limit?')
        .get(viewController.jsonTemp);
};
