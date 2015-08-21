var debug = require('debug')('handlers:debug');
var es = require('event-stream')
var _ = require('lodash');

function DebugHandler() {
  return es.map(function(message, callback) {
    debug(_.pick(message, _.isString));
    callback(null, message);
  });
}

module.exports = DebugHandler; 
