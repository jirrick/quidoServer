'use strict';
module.exports = function(app) {
    const appController = require('../controllers/appController');

    app.route('/')
        .get(appController.main);

    app.route('/listen')
        .get(appController.listen);  

    app.route('/view')
        .get(appController.viewAll);
};
