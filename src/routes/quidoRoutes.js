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

    //CONFIG
    app.route('/config')
        .get(configController.jsonConfigItems);

    app.route('/config/:collection')
        .get(configController.jsonGetAll)
        .post(configController.jsonPostOne);

    app.route('/config/:collection/:id')
        .get(configController.jsonGetOne)
        .put(configController.jsonPutOne)
        .delete(configController.jsonDeleteOne);
};
