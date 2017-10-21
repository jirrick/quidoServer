'use strict';

const QuidoData = require('../models/quidoData');

//View page - last N records
exports.jsonAll = function (req, res) {
    QuidoData.
        find({}).
        limit(getLimit(req)).
        sort('-_id').
        select('_id name inputs').
        exec(function (err, data) {
            if (err)
                res.send(err);

            //badly transform output
            let result = [];
            for (let item of data) {
                let _tmp = {};
                _tmp.name = item.name;
                _tmp.timestamp = item._id.getTimestamp();
                _tmp.inputs = item.inputs;
                result.push(_tmp);
            }
            res.json(result);
        });
};

//View page - last N temps
exports.jsonTemp = function (req, res) {
    QuidoData.
        find({}).
        limit(getLimit(req)).
        sort('-_id').
        select('name inputs').
        exec(function (err, data) {
            if (err)
                res.send(err);

            //badly transform output
            const reversed = data.reverse();
            let result = {};
            for (let item of reversed) {
                result[item.name] = result[item.name] || [];
                let temp = item.inputs.find(input => input.name === 'temp');
                if (temp != null)
                    result[item.name].push(temp.value);
            }
            res.json(result);
        });
};

function getLimit(req) {
    const limit = parseInt(req.params.limit);
    return (limit > 0) ? limit : 100;
}