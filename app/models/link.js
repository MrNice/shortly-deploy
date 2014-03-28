var dbconfig = require('../mongoconfig');
var crypto = require('crypto');
var mongoose = require('mongoose');

var Link = mongoose.model('Link', dbconfig.linkSchema);

module.exports = Link;
