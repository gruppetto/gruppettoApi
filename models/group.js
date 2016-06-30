var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var GroupSchema = new Schema({
  name: String,
  admin: [{type: ObjectId, ref: 'User'}],
  members: [{type: ObjectId, ref: 'User'}]
});

module.exports = mongoose.model('Group', GroupSchema);