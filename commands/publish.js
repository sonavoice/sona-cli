var path = require('path');
var fs = require('fs');
var color = require('colors');
var utils = require('../utils');
var request = require('request');

module.exports.run = function(args) {
  if (utils.getGUID() === null) {
    console.log('You must be logged in to publish extensions.'.yellow);
    return;
  }

  // set name to folder name if undefined
  var name = (args[1]) ? args[1] : path.basename(process.cwd());

  console.log('Publishing ' + name.yellow + '...');

  var filename = process.cwd() + '/extension.js';
  fs.readFile(filename, 'utf-8', function(err, data) {
    if (err) {
      console.log('err =', err);
      console.log('Could not read extension.js');
      return;
    }

    if (!isValidFile(data))
      return;

    var sampleCommands;

    try {
      sampleCommands = getSampleCommands(data);
    } catch(e) {
      console.log(e);
      console.log('sampleCommands is not a valid array.'.red);
      return;
    }

    try {


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
            console.log(('Unable to publish ' + name + '! A server error occurred.').red);
            console.log(body + '(' + response.statusCode + ')');
          } else {
            console.log((name + ' was published successfully!').green);
          }
        });
      });


    } catch(e) {
      console.log(e);
      console.log('Invalid extension. Please check your syntax.'.red);
      return;
    }

  });

  function isValidFile(data) {
    var match = data.match(/(\w+):/g);
    if (!match)
      return false;

    var keys = {};
    for (var i = 0; i < match.length; i++) {
      keys[match[i]] = 1;
    }
    
    if (!keys.hasOwnProperty('title:')) {
      console.log('title property not found.'.red);
      return false;
    }
    if (!keys.hasOwnProperty('iconURL:')) {
      console.log('iconURL property not found.'.red);
      return false;
    }
    if (!keys.hasOwnProperty('commands:')) {
      console.log('commands property not found.'.red);
      return false;
    }
    if (!keys.hasOwnProperty('sampleCommands:')) {
      console.log('sampleCommands property not found.'.red);
      return false;
    }
    return true;
  }

  function getSampleCommands(data) {
    var match = data.match(/sampleCommands:(?:.*?)(\[.*\])/);
    if (!match)
      return [];

    var commands = JSON.parse(match[1].replace(/'/g, '"'));
    return commands;
  }
}
