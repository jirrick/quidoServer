'use strict';
module.exports = function(app) {
    const quido = require('../controllers/quidoController');

    app.route('/')
        .get(quido.main);

    app.route('/listen')
        .get(quido.listen);  

    app.route('/view')
        .get(quido.viewAll);
};
