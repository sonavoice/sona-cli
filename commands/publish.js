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

  console.log('Publishing ' + name.yellow + '...');

  var filename = process.cwd() + '/extension.js';
  fs.readFile(filename, 'utf-8', function(err, data) {
    if (err) {
      utils.error('Could not read extension.js');
      return;
    }

    if (!isValidFile(data))
      return;

    var sampleCommands;

    try {
      sampleCommands = getSampleCommands(data);
    } catch(e) {
      utils.error('sampleCommands is not a valid array.');
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
          if (response === undefined) utils.error('A server error occured');
          else if (response.statusCode !== 200) {
            utils.error('Unable to publish ' + name + '! A server error occured. (' + body + ')[' + (response !== undefined ? response.statusCode : "") + ']');
          } else {
            if (response.body === "updated") {
              console.log((name + ' was updated successfully!').green);
            } else {
              console.log((name + ' was published successfully!').green);
            }
          }

          // Remove zip file when finished uploading
          fs.unlinkSync(utils.lodir(name + '.zip'));
        });
      });


    } catch(e) {
      utils.error('Invalid extension. Please check your syntax.');
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
      utils.error('title property not found.');
      return false;
    }
    if (!keys.hasOwnProperty('iconURL:')) {
      utils.error('iconURL property not found.');
      return false;
    }
    if (!keys.hasOwnProperty('commands:')) {
      utils.error('commands property not found.');
      return false;
    }
    return true;
  }

  function getSampleCommands(data) {
    var match = data.match(/sampleCommands:(?:[\s\S]*?)(\[[\s\S]*\])/);
    if (!match)
      return [];

    var commands = JSON.parse(match[1].replace(/'/g, '"'));
    return commands;
  }
}
