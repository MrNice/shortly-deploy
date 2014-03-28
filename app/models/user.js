var dbconfig = require('../mongoconfig');
var mongoose = require('mongoose');

var User = mongoose.model('User', dbconfig.userSchema);

module.exports = User;
