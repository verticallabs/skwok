var debug = require('debug')('handlers:filter');
var es = require('event-stream')
var _ = require("lodash");

function FilterHandler(strings) {
  return es.map(function(message, callback) {
    var match = _.reduce(strings, function(result, s) {
      return result || message.matches(s);
    }, false);


    if(match) {
      callback(null, message);
    }
    else {
      callback();
    }
  });
}

module.exports = FilterHandler; 
