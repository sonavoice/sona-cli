var path = require('path');
var fs = require('fs');
var color = require('colors');
var utils = require('../utils');
var request = require('request');

module.exports.run = function(args) {
  if (utils.getGUID() === null) {
    console.log("You must be logged in to publish extensions.".yellow);
    return
  }

  // set name to folder name if undefined
  var name = (args[1]) ? args[1] : path.basename(process.cwd());

  console.log("Publishing " + name.yellow + "...");

  var ext;
  try {
    ext = require(process.cwd() + '/extension');
  } catch(e) {
    console.log('Unable to load file. Please check your syntax.'.red);
    console.log(e);
    return;
  }

  if (!isValidFile(ext)) {
    return;
  }

  utils.zip('.', name, function() {

    var host;
    var demo = false;

    host = (demo) ? 'http://localhost:3000' : 'https://sonavoice.com';

    var formData = {
      guid: utils.getGUID(),
      extension: fs.createReadStream(utils.lodir(name + '.zip')),
      email: utils.getEmail(),
      name: name,
    };

    request.post({url:host + '/extension', formData: formData}, function (err, response, body) {
      if (response === undefined || response.statusCode !== 200) {
        console.log(("Unable to publish " + name + "! A server error occured.").red);
        console.log(body + "(" + response.statusCode + ")");
      } else {
        console.log((name + " was published successfully!").green);
      }
    });
  });

  function isValidFile(obj) {
    if (!obj.hasOwnProperty('title')) {
      console.log('Missing title.'.red);
      return false;
    } else if (!obj.hasOwnProperty('iconURL')) {
      console.log('Missing iconURL.'.red);
      return false;
    } else if (!obj.hasOwnProperty('commands')) {
      console.log('Missing commands'.red);
      return false;
    } else if (!obj.hasOwnProperty('sampleCommands')) {
      console.log('Missing sample commands'.red);
      return false;
    } else {
      return true;
    }
  }
}