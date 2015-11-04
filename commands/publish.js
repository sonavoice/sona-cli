var path = require('path');
var fs = require('fs');
var color = require('colors');
var utils = require('../utils');
var request = require('request');

module.exports.run = function(args) {
  if (utils.getGUID() === null) {
    utils.warning('You must be logged in to publish extensions.');
    return;
  }

  // set name to folder name if undefined
  var name = (args[1]) ? args[1] : path.basename(process.cwd());

  console.log("Publishing " + name.yellow + "...");

  var filename = process.cwd() + '/extension.js';
  fs.readFile(filename, 'utf-8', function(err, data) {
    if (err) {
      utils.error("Could not load extension.js");
      return;
    }

    try {
      var obj = JSON.parse(data);
      if (!isValidFile(obj)) {
        utils.error('You are missing properties in your extension.');
        return;
      }

      utils.zip('.', name, function() {

        var host;
        var demo = false;
        if (!demo) {
          host = "https://sonavoice.com";
        } else {
          host = "http://localhost:3000";
        }

        var formData = {
          guid: utils.getGUID(),
          extension: fs.createReadStream(utils.lodir(name + '.zip')),
          email: utils.getEmail(),
          name: name,
        };

        request.post({url:host + '/extension', formData: formData}, function (err, response, body) {
          if (response === undefined || response.statusCode !== 200) {
            utils.error("Unable to publish " + name + "! A server error occured. (" + body + ")[" + response.statusCode + "]");
          } else {
            console.log((name + " was published successfully!").green);
          }
        });
      });


    } catch(e) {
      utils.error('Invalid extension. Please check your syntax.');
      return;
    }

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
    } else {
      return true;
    }
  }
}
