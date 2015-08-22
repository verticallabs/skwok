var debug = require('debug')('filters');
var util = require('util');
var _ = require('lodash');

function hasState() {
  var states = Array.prototype.slice.call(arguments);

  return function(message) {
    debug('hasState')

    if(message.stateMatches(states)) {
      return message;
    }
  }
}

function hasFromState() {
  var states = Array.prototype.slice.call(arguments);

  return function(message) {
    debug('hasFromState')

    if(message.from.stateMatches(states)) {
      return message;
    }
  }
}


function hasBody() {
  var bodies = Array.prototype.slice.call(arguments);

  return function(message) {
    debug('hasBody')

    if(message.bodyMatches(bodies)) {
      return message;
    }
  }
}

module.exports = {
  hasState: hasState,
  hasFromState: hasFromState,
  hasBody: hasBody,
};
