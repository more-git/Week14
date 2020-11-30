var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var timerSchema = new Schema({
    time: {type:String, require:true},
    task_id: {type:String, require:true},
}, {collection: 'timers'});
exports.timerSchema = timerSchema;
