'use strict';

const server = require('../server');

exports.setValue = function (req, res) {
    const name = req.params.name;
    const value = parseInt(req.params.value);
    let result = 'group not found';

    //check negative value
    if (value < 0){
        res.send('value must be positive');
        return;
    }

    //loop all boards
    for (let board of server.boards) {
        // try set value
        const response = board.setOutput(name, value);
        // break loop when response is other than 'group not found' - either 'succes' or 'not initialized'...
        //TODO do this better
        if (response !== result){
            result = response;
            break;
        }
    }
    res.send(result);
};

exports.getValue = function (req, res) {
    const name = req.params.name;
    let result = 0;

    //loop all boards
    for (let board of server.boards) {
        // try get value
        const response = board.getValue(name);

        if (response >= 0){
            result = response;
            break;
        }
    }
    res.send(result.toString());
};