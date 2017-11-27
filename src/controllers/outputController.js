'use strict';

const logger = require('../logger'),
    OutputGroup = require('../models/quidoOutputGroup'),
    errorController = require('./errorController');

exports.setValue = async function (req, res, next) {
    try {
        const name = req.params.name;
        const value = parseInt(req.params.value);
        let result = '';

        //check negative value
        if (value < 0) {
            res.send('value must be positive');
            return;
        }

        //find specified group
        const group = await OutputGroup.findOne({ '_id': name });

        if (group != null) {
            //check value is in bounds
            if (value >= group.minValue && value <= group.maxValue) {
                //check if value can be reached
                if ((value - group.minValue) % group.step == 0) {
                    group.value = value;
                    group.save();
                    const success = `output group "${name}" set to value "${value}"`;
                    logger.debug(success);
                    result = success;
                } else
                    result = 'value within bounds, but not reachable';
            } else
                result = 'not a number or value out of bounds';
        } else {
            result = 'group not found';
        }
        res.send(result);
        return result;
    } catch (err) {
        errorController.handle(next, err);
    }
};

exports.getValue = async function (req, res, next) {
    try {
        const name = req.params.name;
        let result = -1;

        //find specified group
        const group = await OutputGroup.findOne({ '_id': name });

        if (group != null) {
            result = group.value;
        }
        res.send(result.toString());
    } catch (err) {
        errorController.handle(next, err);
    }

};