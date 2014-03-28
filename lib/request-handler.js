var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');

var db = require('../app/mongoconfig').db;
var User = require('../app/models/user');
var Link = require('../app/models/link');

db.on('error', console.error.bind(console, 'connection error:'));

exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function(){
    res.redirect('/login');
  });
};

exports.fetchLinks = function(req, res) {
  Links.reset().fetch().then(function(links) {
    res.send(200, links.models);
  })
};

exports.saveLink = function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.send(404);
  }

  new Link.findOne({ url: uri }, function(found) {
    if (found) {
      res.send(200, found.attributes);
    } else {
      util.getUrlTitle(uri, function(err, title) {
        if (err) {
          console.log('Error reading URL heading: ', err);
          return res.send(404);
        }

        var link = new Link({
          url: uri,
          title: title,
          base_url: req.headers.origin
        });

        link.save(err, function(newLink) {
          Links.add(newLink);
          res.send(200, newLink);
        });
      });
    }
  });
};

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({username: username},
    function(err, user) {
      console.log('During login: ', user);
      if (!user) {
        res.redirect('/signup');
      } else {
        user.comparePassword(password, function(match) {
          if (match) {
            util.createSession(req, res, user);
          } else {
            res.redirect('/login');
          }
        });
      }
    }
  );
};

exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  console.log(username, password);

  User.findOne({username: username},
    function(err, user) {
      console.log('The user is: ', user);
      if (!user) {
        var newUser = new User({
          username: username,
          password: password
        });
        newUser.hashPassword(newUser.save);
        console.log('New user created: ', newUser);

      } else {
        console.log('Account already exists');
      }
      res.redirect('/login');
    });
};

exports.navToLink = function(req, res) {
  new Link.findOne({ code: req.params[0] }, function(link) {
    if (!link) {
      res.redirect('/');
    } else {
      link.set({ visits: link.get('visits') + 1 })
        .save()
        .then(function() {
          return res.redirect(link.get('url'));
      });
    }
  });
};
