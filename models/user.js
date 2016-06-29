
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var UserSchema   = new Schema({
  name: String,
  fbId: String,
  email : String,
  pictureUrl: String
});

module.exports = mongoose.model('User', UserSchema);