'use strict';
const express = require('express'),
    helmet = require('helmet'),
    app = express(),
    environment = process.env.NODE_ENV || 'development',
    port = process.env.PORT || 3001;

function rndOut() {
    var text = "";
    var possible = "01x";
    
    for (var i = 0; i < 8; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    
    return text;
    }

app.use(helmet());

app.get('/', function (req, res) {
    res.send('Welcome to jirrick\'s quidoServer @ ' + environment);
})


app.get('/listen', function (req, res) {
    console.log(req.originalUrl);
    var outs = rndOut();
    res.set('Content-Type', 'text/xml');
    res.send('<?xml version="1.0" encoding="ISO-8859-1"?><root><set outs="' + outs + '"/></root>');
})


app.listen(port);

console.log('quido server started on: ' + port);

