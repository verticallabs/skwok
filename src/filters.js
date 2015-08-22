var util = require('util');
var _ = require('lodash');

function hasState() {
  var debug = require('debug')('filters:hasState');
  var states = Array.prototype.slice.call(arguments);

  return function(message) {
    if(message.stateMatches(states)) {
      return message;
    }
  }
}

function hasFromState() {
  var debug = require('debug')('filters:hasFromState');
  var states = Array.prototype.slice.call(arguments);

  return function(message) {
    if(message.from.stateMatches(states)) {
      return message;
    }
  }
}


function hasBody() {
  var debug = require('debug')('filters:hasFromState');
  var bodies = Array.prototype.slice.call(arguments);

  return function(message) {
    if(message.bodyMatches(bodies)) {
      return message;
    }
  }
}

function unhandled() {
  var debug = require('debug')('filters:unhandled');
  return function(message) {
    if(!message.handled) {
      return message;
    }
  }
}

module.exports = {
  hasState: hasState,
  hasFromState: hasFromState,
  hasBody: hasBody,
  unhandled: unhandled
};
