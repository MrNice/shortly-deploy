var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');

mongoose.connect('mongodb://localhost/shortly');

var userSchema = mongoose.Schema({
  username: String,
  password: String
});

userSchema.method('comparePassword', function(attemptedPassword, callback) {
  console.log('ComparePassword is working');
  bcrypt.compare(attemptedPassword, this.get('password'), function(err, isMatch) {
    callback(isMatch);
  });
});

userSchema.method('hashPassword', function(callback){
  var cipher = Promise.promisify(bcrypt.hash);
  return cipher(this.get('password'), null, null).bind(this)
  .then(function(hash) {
  console.log('hashPassword is working');
    this.set('password', hash);
    callback();
  });
});

exports.userSchema = userSchema;

exports.linkSchema = mongoose.Schema({
  url: String,
  base_url: String,
  code: String,
  title: String,
  visits: Number,
  //Need Timestamps
});
  // link.timestamps();

exports.db = mongoose.connection;
