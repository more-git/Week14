var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var projectSchema = new Schema({
    name: {type: String, index: 1, require:true},
    //start: Date,
    //end: Date
}, {collection: 'names'});
exports.projectSchema = projectSchema;
