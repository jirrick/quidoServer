'use strict';

//Handle 'PRAVY' board
exports.process = function (boardInfo, req, res) {
    //Send reply - do random shit
    const outs = rndOut(boardInfo.outputs);
    res.set('Content-Type', 'text/xml');
    res.send('<?xml version="1.0" encoding="ISO-8859-1"?><root><set outs="' + outs + '"/></root>');
};

//Generate random output
function rndOut(n) {
    let text = '';
    const possible = '01x';

    for (var i = 0; i < n; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}