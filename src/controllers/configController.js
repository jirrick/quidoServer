'use strict';

const logger = require('../logger'),
    quidoModels = require('../models/quidoModels'),
    errorController = require('./errorController');

//list names of all config items
exports.jsonConfigItems = async function (req, res, next) {
    try {
        let result = new Object();
        result.boards = await quidoModels.board.find({}).lean().distinct('_id');
        result.inputGroups = await quidoModels.inputGroup.find({}).lean().distinct('_id');
        result.outputGroups = await quidoModels.outputGroup.find({}).lean().distinct('_id');
        result.triggers = await quidoModels.trigger.find({}).lean().distinct('_id');

        res.send(result);
    } catch (err) {
        errorController.handle(next, err);
    }
};

//list all configurations
exports.jsonGetAll = async function (req, res, next) {
    try {
        // load model by name
        const model = getModel(req);
        if (model) {
            const result = await model.find({})
                .lean().select('-__v');
            res.send(result);
        } else {
            res.status(400).send('Unknown collection.');
        }
    } catch (err) {
        errorController.handle(next, err);
    }
};

//add new configuration (id must be specified)
exports.jsonPostOne = async function (req, res, next) {
    try {
        // load model by name
        const model = getModel(req);
        if (model) {
            //load data from request, content type must be JSON
            const request = req.body;

            //validate
            if (!request._id) {
                res.status(400).send('Item name (property "_id") not specified.');
                return;
            }

            //save to db
            const item = new model();
            Object.assign(item, request);
            item.save()
                .then(function (data) {
                    const status = `${model.modelName} item "${data._id}" insterted succefully.`;
                    logger.verbose(status);
                    logger.debug(data.toString());
                    res.status(200).send(status);
                })
                .catch(function (err) {
                    logger.warn(err);
                    res.status(400).send('Failed to add configuration. Content-Type must be set to JSON.');
                });
        } else {
            res.status(400).send('Unknown collection.');
        }
    } catch (err) {
        errorController.handle(next, err);
    }
};

//return particular configuration
exports.jsonGetOne = async function (req, res, next) {
    try {
        // load model by name
        const model = getModel(req);
        if (model) {
            const id = req.params.id;
            const result = await model.findById(id)
                .lean().select('-__v');
            res.send(result);
        } else {
            res.status(400).send('Unknown collection.');
        }
    } catch (err) {
        errorController.handle(next, err);
    }
};

//updateparticular configuration
exports.jsonPutOne = async function (req, res, next) {
    try {
        // load model by name
        const model = getModel(req);
        if (model) {
            //find item
            const id = req.params.id;
            const item = await model.findById(id);

            //load data from request (content type must be JSON) and update 
            const request = req.body;
            Object.assign(item, request);

            //validate
            if (request._id !== id) {
                res.status(400).send('Object ID changed, update canceled.');
                return;
            }

            //save item
            item.save()
                .then(function (data) {
                    const status = `${model.modelName} item "${data._id}" updated succefully.`;
                    logger.verbose(status);
                    logger.debug(data.toString());
                    res.status(200).send(status);
                })
                .catch(function (err) {
                    logger.warn(err);
                    res.status(400).send('Failed to update configuration. Content-Type must be set to JSON.');
                });
        } else {
            res.status(400).send('Unknown collection.');
        }
    } catch (err) {
        errorController.handle(next, err);
    }
};

//return particular configuration
exports.jsonDeleteOne = async function (req, res, next) {
    try {
        // load model by name
        const model = getModel(req);
        if (model) {
            const id = req.params.id;
            model.findByIdAndRemove(id)
                .then(function (data) {
                    const status = `${model.modelName} item "${data._id}" deleted succefully.`;
                    logger.verbose(status);
                    logger.debug(data.toString());
                    res.status(200).send(status);
                })
                .catch(function (err) {
                    logger.warn(err);
                    res.status(400).send(`Failed to delete ${model.modelName} item.`);
                });
        } else {
            res.status(400).send('Unknown collection.');
        }
    } catch (err) {
        errorController.handle(next, err);
    }
};

// get Model by name for generic CRUD methods
function getModel(req) {
    const collection = req.params.collection;
    let result = null;

    if (collection.toUpperCase() === 'BOARD') {
        result = quidoModels.board;
    } else if (collection.toUpperCase() === 'INPUTGROUP') {
        result = quidoModels.inputGroup;
    } else if (collection.toUpperCase() === 'OUTPUTGROUP') {
        result = quidoModels.outputGroup;
    } else if (collection.toUpperCase() === 'TRIGGER') {
        result = quidoModels.trigger;
    }

    return result;
}