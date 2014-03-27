var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/shortly');

var userSchema = mongoose.Schema({
  username = String,
  password = String
});

