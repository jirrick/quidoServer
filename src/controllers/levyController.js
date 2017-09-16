'use strict';

const mongoose = require('mongoose'),
    Logs = mongoose.model('Logs');

//Handle 'LEVY' board
exports.process = function (boardInfo, req, res) {
    //Parse data from request into object
    const parsed = new Object();
    parsed.name = req.query.name;
    parsed.temp = req.query.tempV;
    parsed.timestamp = Date.now();
    const tmpCounters = [];
    for (let i = 1; i <= boardInfo.inputs; i++) {
        const key = `cnt${i}`;
        tmpCounters.push(parseInt(req.query[key]));
    }
    parsed.counters = tmpCounters;

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
