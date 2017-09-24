'use strict';

const appController = require('../controllers/appController'),
    boardController = require('../controllers/boardController'),
    viewController = require('../controllers/viewController'),
    outputController = require('../controllers/outputController');

module.exports = function (app) {
    app.route('/')
        .get(appController.main);

    app.route('/listen')
        .get(boardController.parse);

    app.route('/output/:name')
        .get(outputController.getValue);

    app.route('/output/:name/:value')
        .get(outputController.setValue);

    app.route('/view/:limit?')
        .get(viewController.jsonAll);

    app.route('/temps/:limit?')
        .get(viewController.jsonTemp);
};
