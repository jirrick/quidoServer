'use strict';

const appController = require('../controllers/appController'),
    boardController = require('../controllers/boardController'),
    configController = require('../controllers/configController'),
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
        .get(configController.jsonConfigItems);

    //CONFIG - boards
    app.route('/config/boards')
        .get(configController.jsonGetBoards)
        .post(configController.jsonPostBoard);

    app.route('/config/boards/:id')
        .get(configController.jsonGetBoard)
        .put(configController.jsonPutBoard)
        .delete(configController.jsonDeleteBoard);

    /* //CONFIG - input groups
    app.route('/config/inputs')
        .get(configController.jsonGetInputs)
        .post(configController.jsonPostInput);

    app.route('/config/inputs/:id')
        .get(configController.jsonGetInput)
        .put(configController.jsonPutInput)
        .delete(configController.jsonDeleteInput); */
};
