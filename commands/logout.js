var utils = require('../utils');

module.exports.run = function(args) {
  if (utils.getGUID() != null) {
    utils.success("Logged out of " + utils.getEmail() + "!");
    utils.setEmail(null);
    utils.setGUID(null);
  } else {
    utils.error("You aren't logged in.");
  }
};
