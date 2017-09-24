'use strict';

//Handle 'PRAVY' board
exports.process = function (boardInfo, req, res) {
    //Send reply from board class
    const outs = boardInfo.getOutput();

    res.set('Content-Type', 'text/xml');
    res.send('<?xml version="1.0" encoding="ISO-8859-1"?><root><set outs="' + outs + '"/></root>');
};