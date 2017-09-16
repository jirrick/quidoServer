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

//View page - last 25 records
exports.viewAll = function (req, res) {
    Logs.
        find({}).
        limit(25).
        sort('-timestamp').
        select('-_id name temp timestamp counters').
        exec(function (err, data) {
            if (err)
                res.send(err);
            res.json(data);
        });
};

