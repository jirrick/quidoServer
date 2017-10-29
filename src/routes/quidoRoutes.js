'use strict';

const appController = require('../controllers/appController'),
    boardController = require('../controllers/boardController'),
    viewController = require('../controllers/viewController'),
    outputController = require('../controllers/outputController');

module.exports = function (app) {
    //MAIN
    app.route('/')
        .get(appController.main);

    //PARSING
    app.route('/listen')
        .get(boardController.parse);

    //OUTPUT VALUES
    app.route('/output/:name')
        .get(outputController.getValue);

    app.route('/output/:name/:value')
        .get(outputController.setValue);

    //BROWSE DATA
    app.route('/view/:limit?')
        .get(viewController.jsonAll);

    app.route('/temps/:limit?')
        .get(viewController.jsonTemp);

    //CONFIG - general
    app.route('/config')
        .get(appController.jsonConfigItems);

    //CONFIG - boards
    app.route('/config/boards')
        .get(appController.jsonGetBoards)
        .post(appController.jsonPostBoard);

    app.route('/config/boards/:id')
        .get(appController.jsonGetBoard)
        .put(appController.jsonPutBoard)
        .delete(appController.jsonDeleteBoard);
};
