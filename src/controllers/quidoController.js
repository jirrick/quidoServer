'use strict';

const mongoose = require('mongoose'),
    Logs = mongoose.model('Logs'),
    environment = process.env.NODE_ENV || 'development';

//Index page
exports.main = function (req, res) {
    res.send('Welcome to jirrick\'s quidoServer @ ' + environment);
};

//Listen page
exports.listen = function (req, res) {
    //console.log(req.originalUrl);

    //do different stuff for different board
    if (req.query.name === 'LEVY')
        levy(req, res);
    else if (req.query.name === 'PRAVY')
        pravy(req, res);
    else 
        res.status(400).send('Invalid request!');
};

//View page
exports.viewAll = function (req, res) {
    Logs.find({}, function (err, task) {
        if (err)
            res.send(err);
        res.json(task);
    });
};

//Private methods ----------------------------------------
//Generate random output
function rndOut() {
    let text = '';
    const possible = '01x';

    for (var i = 0; i < 8; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

//Handle 'LEVY' board
function levy(req, res){
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

    //Send reply - do nothing
    res.set('Content-Type', 'text/xml');
    res.send('<?xml version="1.0" encoding="ISO-8859-1"?><root><set outs="xxxxxxxx"/></root>');
}

//Handle 'PRAVY' board
function pravy(req, res){
    //Send reply - do random shit
    const outs = rndOut();
    res.set('Content-Type', 'text/xml');
    res.send('<?xml version="1.0" encoding="ISO-8859-1"?><root><set outs="' + outs + '"/></root>');
}