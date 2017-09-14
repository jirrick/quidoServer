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
    //console.log(req.originalUrl);

    //Parse data from request into object
    const parsed = new Object();
    parsed.name = req.query.name;
    parsed.mac = req.query.mac;
    parsed.temp = req.query.tempV;
    parsed.timestamp = Date.now();

    //Create Log item and save to mongo
    const newLog = new Logs(parsed);
    newLog.save(function (err, data) {
        if (err)
            console.error(err);
        console.log(data);
    });

    const outs = 'xxxxxxxx'; //rndOut();
    res.set('Content-Type', 'text/xml');
    res.send('<?xml version="1.0" encoding="ISO-8859-1"?><root><set outs="' + outs + '"/></root>');
};

exports.viewAll = function (req, res) {
    Logs.find({}, function (err, task) {
        if (err)
            res.send(err);
        res.json(task);
    });
};
