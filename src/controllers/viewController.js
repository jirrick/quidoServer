'use strict';

const mongoose = require('mongoose'),
    Logs = mongoose.model('Logs');

//View page - last N records
exports.jsonAll = function (req, res) {
    Logs.
        find({}).
        limit(getLimit(req)).
        sort('-_id').
        select('_id name temp counters').
        exec(function (err, data) {
            if (err)
                res.send(err);

            //badly transform output
            let result = [];
            for (let item of data) {
                let _tmp = {};
                _tmp.name = item.name;
                _tmp.timestamp = item._id.getTimestamp();
                _tmp.temp = item.temp;
                _tmp.counters = item.counters;
                result.push(_tmp);
            }
            res.json(result);
        });
};

//View page - last N temps
exports.jsonTemp = function (req, res) {
    Logs.
        find({}).
        limit(getLimit(req)).
        sort('-_id').
        select('name temp').
        exec(function (err, data) {
            if (err)
                res.send(err);

            //badly transform output
            const reversed = data.reverse();
            let result = {};
            for (let item of reversed) {
                result[item.name] = result[item.name] || [];
                result[item.name].push(item.temp);
            }
            res.json(result);
        });
};

function getLimit(req) {
    const limit = parseInt(req.params.limit);
    return (limit > 0) ? limit : 100;
}