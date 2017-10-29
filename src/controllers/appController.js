'use strict';

const environment = process.env.NODE_ENV || 'no-environment',
    version = require('../../package.json').version;

//Index page
exports.main = function (req, res) {
    res.send(`Welcome to jirrick's quidoServer v${version} @ ${environment}`);
};