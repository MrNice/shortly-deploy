var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/shortly');

exports.userSchema = mongoose.Schema({
  username: String,
  password: String
});

exports.db = mongoose.connection;
