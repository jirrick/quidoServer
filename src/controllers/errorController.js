'use strict';

const logger = require('../logger');
 
exports.handle = function (next, err) {
    //1) log using winston
    logger.error(err);
    //2) pass error to strong-error-handler (print full stack only in dev)
    next(err);
};