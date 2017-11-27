// initialize all mongo models
const
    InputGroup = require('./quidoInputGroup'),
    OutputGroup = require('./quidoOutputGroup'),
    Board = require('./quidoBoard'),
    DataLog = require('./quidoDataLog'),
    Trigger = require('./quidoTrigger');

exports.inputGroup = InputGroup;
exports.outputGroup = OutputGroup;
exports.board = Board;
exports.datalog = DataLog;
exports.trigger = Trigger;