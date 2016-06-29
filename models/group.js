
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var GroupSchema   = new Schema({
  name: String,
  admin: [String],
  members: [String]
});

module.exports = mongoose.model('Group', GroupSchema);