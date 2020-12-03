var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var timerSchema = new Schema({
    datetime: {type:String, require:true},
    task_id: {type:String, require:true},
}, {collection: 'timers'});
exports.timerSchema = timerSchema;
