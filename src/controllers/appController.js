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

//View page - last N records
exports.view = function (req, res) {
    const _limit = parseInt(req.params.limit);
    let limit = 25;
    if (_limit > 0) limit = _limit;
    
    Logs.
        find({}).
        limit(limit).
        sort('-_id').
        select('_id name temp counters').
        exec(function (err, data) {
            if (err)
                res.send(err);

            //badly transform output
            let item;
            let result = [];
            for (item of data) {
                let _tmp = {};
                _tmp.timestamp = item._id.getTimestamp();
                _tmp.temp = item.temp;
                _tmp.counters = item.counters;
                result.push(_tmp);
            }

            res.json(result);
        });
};

