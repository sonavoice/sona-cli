var fs = require('fs.extra');
var utils = require('../utils');

module.exports.run = function(args) {
  var DIR_ALREADY_INIT = 'Error: It looks like this directory has already been initialized.';
  var directory = ".";

  if (args[1] !== undefined) {
    try {
      fs.mkdirSync(args[1]);
    } catch(e) {
      console.log("Warning: This directory already exists.".yellow);
      return;
    }
    directory = args[1];
  }

  fs.copyRecursive(utils.lodir('template/'), directory + "/", function(err) {
    if (err) console.log(DIR_ALREADY_INIT.red);
    else {
      console.log(('Initialized empty Sona extension in ' + process.cwd() + (directory !== "." ? "/" + directory : "")).green);
    }
  });
};
