'use strict';

const mongoose = require('mongoose'),
    Logs = mongoose.model('Logs');

//Handle 'LEVY' board
exports.process = function (boardInfo, req, res) {
    //Parse data from request into object
    let resetCounters = false;
    const tmpCounters = [];
    for (let i = 1; i <= boardInfo.inputs; i++) {
        const key = `cnt${i}`;
        const value = parseInt(req.query[key]);
        tmpCounters.push(value);
        //Reset counters if one value is over treshold
        if (value > 10000) resetCounters = true;
    }
    const parsed = new Object();
    parsed.name = req.query.name;
    parsed.temp = req.query.tempV;
    parsed.timestamp = Date.now();
    parsed.counters = tmpCounters;

    //Create Log item and save to mongo
    const newLog = new Logs(parsed);
    newLog.save(function (err, data) {
        if (err)
            console.error(err);
        console.log(data);
    });

    //Send reply
    //TODO use board class
    let command = 'outs="xxxxxxxx"';
    if (resetCounters)
        command += resetString(tmpCounters);
    console.log(command);
    let reply = `<?xml version="1.0" encoding="ISO-8859-1"?><root><set ${command}/></root>`;
    res.set('Content-Type', 'text/xml');
    res.send(reply);
};

//Generate reset counters string
function resetString(arr) {
    let text = '';
    for (var i = 0, len = arr.length; i < len; i++) {
        text += ` cnt${i+1}="${arr[i]}"`;
    }

    return text;
}