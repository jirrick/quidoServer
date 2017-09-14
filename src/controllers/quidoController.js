'use strict';

const mongoose = require('mongoose'),
    Logs = mongoose.model('Logs'),
    environment = process.env.NODE_ENV || 'development';

function rndOut() {
    let text = '';
    const possible = '01x';

    for (var i = 0; i < 8; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

exports.main = function (req, res) {
    res.send('Welcome to jirrick\'s quidoServer @ ' + environment);
};

exports.listen = function (req, res) {
    console.log(req.originalUrl);
    const outs = rndOut();
    res.set('Content-Type', 'text/xml');
    res.send('<?xml version="1.0" encoding="ISO-8859-1"?><root><set outs="' + outs + '"/></root>');
};
