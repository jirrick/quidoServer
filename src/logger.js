'use strict';
const winston = require('winston'),
    logLevel = process.env.CONSOLE_LEVEL || 'debug';

//set up logger
const logTimeFormat = () => (new Date()).toLocaleTimeString(),
    logger = new (winston.Logger)({
        transports: [
            new (winston.transports.Console)({
                timestamp: logTimeFormat,
                level: logLevel
            })
        ]
    });
    
module.exports = logger;
