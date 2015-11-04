var path     = require('path');
var fs       = require('fs.extra');
var color    = require('colors');
var request  = require('request');
var prompt   = require('prompt');
var utils    = require('../utils');
var pack     = require('../package.json');

module.exports.run = function(args) {
  var host;
  var email;
  var demo = false;

  host = (demo) ? 'http://localhost:3000' : 'https://sonavoice.com';

  prompt.message = pack.name;
  prompt.start();
  prompt.get([{
    name: 'email',
    pattern: /@/,
    required: true
  }, {
    name: 'password',
    hidden: true
  }], function (err, result) {
    email = result.email;
    request.post(host + "/developer", {
      form: {
        email: result.email,
        password: result.password
      }
    }, function(err, response, body) {
      if (response.statusCode === 201) {
        console.log("New account created successfully! You are logged in!".green);
        utils.setGUID(response.body);
        utils.setEmail(email);
      } else if (response.statusCode === 200) {
        console.log("Logged in successfully!".green);
        utils.setGUID(response.body);
        utils.setEmail(email);
      } else if (response.statusCode === 401) {
        console.log("Invalid login!".red);
      }
    });
  });
};