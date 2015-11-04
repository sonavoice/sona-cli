var request = require('request');

module.exports = {
  title: 'extension',
  iconURL: 'logo.png',
  commands: {
    'to $1 say $2': function(cb, auth, args) {
      var user = args[0];
      var message = args[1];
    }
  },
  sampleCommands: ['To Sarah say I\'m running late']
}