'use strict';

const server = require('../server'),
    Board = require('../models/quidoBoard'),
    DataLog = require('../models/quidoDataLog');

//Parse board request
exports.parse = async function (req, res) {
    server.logger.debug(req.originalUrl);

    try {
        const req_name = req.query.name;
        const req_mac = req.query.mac;
        
        //load board info and populate groups
        const boardInfo = await Board.findOne({
            '_id': req_name,
            'mac': req_mac
        }).populate('inputGroups')
            .populate('outputGroups')
            .exec();

        //array containing values to be subtracted from board counters
        boardInfo.resetCounters = Array(boardInfo.inputs).fill(0);

        if (boardInfo != null) {
            //parse counters into array
            const inputCounters = [];
            for (let i = 1; i <= boardInfo.inputs; i++) {
                const key = `cnt${i}`;
                const value = parseInt(req.query[key]);
                inputCounters.push(value);
            }
            const ins = req.query.ins,
                outs = req.query.outs;

            //parse inputs
            const parsedInputs = boardInfo.parseInput(ins, inputCounters);
            //add temp to parsed inputs
            const temp = new Object();
            temp.name = 'temp';
            temp.value = req.query.tempV;
            parsedInputs.push(temp);

            //Create new DataLog item and save to mongo
            const newItem = new DataLog({
                name: req.query.name,
                inputs: parsedInputs
            });
            newItem.save(function (err, data) {
                if (err)
                    server.logger.warn(err);
                server.logger.verbose(`Received ${data.inputs.length} inputs from ${data.name} board`);
                server.logger.debug(data.toString());
            });

            //Update current status of board
            boardInfo.saveCurrentState(ins, inputCounters, outs);

            //send response
            const reply = boardInfo.getResponse();
            server.logger.debug(reply);
            res.set('Content-Type', 'text/xml');
            res.send(reply);
        }
        else
            res.status(400).send('Unknown board!');

    } catch (err) {
        server.logger.error(err);
    }
};
