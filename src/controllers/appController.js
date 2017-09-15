'use strict';

const mongoose = require('mongoose'),
    Logs = mongoose.model('Logs'),
    config = require('../config'),
    boardController = require('./boardController'),
    environment = process.env.NODE_ENV || 'development';

//Index page
exports.main = function (req, res) {
    res.send('Welcome to jirrick\'s quidoServer @ ' + environment);
};

//Listen page
exports.listen = function (req, res) {
    //console.log(req.originalUrl);

    //verify board
    const req_name = req.query.name;
    const req_mac = req.query.mac;
    const found = config.boards.find(board => board.name === req_name && board.mac === req_mac);

    if (found != null) {
        //do different stuff for different board
        if (req_name === 'LEVY')
            boardController.levy(req, res);
        else if (req_name === 'PRAVY')
            boardController.pravy(req, res);
    }
    else 
        res.status(400).send('Unknown board!');
};

//View page
exports.viewAll = function (req, res) {
    Logs.find({}, '-_id name temp timestamp', function (err, data) {
        if (err)
            res.send(err);
        res.json(data);
    });
};

