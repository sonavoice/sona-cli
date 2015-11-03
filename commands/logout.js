var utils = require('../utils');

module.exports.run = function(args) {
  if (utils.getGUID() != null) {
    console.log(("Logged out of " + utils.getEmail() + "!").green);;
    utils.setEmail(null);
    utils.setGUID(null);
  } else {
    console.log("You aren't logged in.");
  }
};
