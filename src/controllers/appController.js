'use strict';

const mongoose = require('mongoose'),
    Logs = mongoose.model('Logs'),
    boardController = require('./boardController'),
    environment = process.env.NODE_ENV || 'development';

//Index page
exports.main = function (req, res) {
    res.send('Welcome to jirrick\'s quidoServer @ ' + environment);
};

//Listen page
exports.listen = function (req, res) {
    //console.log(req.originalUrl);
    
    boardController.parse(req, res);
};

//View page
exports.viewAll = function (req, res) {
    Logs.find({}, '-_id name temp timestamp counters', function (err, data) {
        if (err)
            res.send(err);
        res.json(data);
    });
};

