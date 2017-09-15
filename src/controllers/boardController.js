'use strict';

const mongoose = require('mongoose'),
    Logs = mongoose.model('Logs');

//Handle 'LEVY' board
exports.levy = function (req, res) {
    //Parse data from request into object
    const parsed = new Object();
    parsed.name = req.query.name;
    parsed.temp = req.query.tempV;
    parsed.timestamp = Date.now();

    //Create Log item and save to mongo
    const newLog = new Logs(parsed);
    newLog.save(function (err, data) {
        if (err)
            console.error(err);
        console.log(data);
    });

    //Send reply - do nothing
    res.set('Content-Type', 'text/xml');
    res.send('<?xml version="1.0" encoding="ISO-8859-1"?><root><set outs="xxxxxxxx"/></root>');
};

//Handle 'PRAVY' board
exports.pravy = function (req, res) {
    //Send reply - do random shit
    const outs = rndOut();
    res.set('Content-Type', 'text/xml');
    res.send('<?xml version="1.0" encoding="ISO-8859-1"?><root><set outs="' + outs + '"/></root>');
};

//Generate random output
function rndOut() {
    let text = '';
    const possible = '01x';

    for (var i = 0; i < 8; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}