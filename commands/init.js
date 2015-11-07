var fs    = require('fs.extra');
var utils = require('../utils');

module.exports.run = function(args) {
  var directory = '.';

  if (args[1] !== undefined) {
    try {
      fs.mkdirSync(args[1]);
    } catch(e) {
      utils.warning('This directory already exists.');
      return;
    }
    directory = args[1];
  }

  fs.copyRecursive(utils.lodir('template'), directory + '/', function(err) {
    if (err) utils.error('It looks like this directory has already been initialized.');
    else {
      utils.success('Initialized empty Sona extension in ' + process.cwd() + (directory !== '.' ? '/' + directory : ''));
    }
  });
};
