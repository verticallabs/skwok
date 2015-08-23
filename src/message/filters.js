var debug = require('debug')('message:filters');
var util = require('util');
var _ = require('lodash');

function hasState() {
  var states = Array.prototype.slice.call(arguments);

  return function(message) {
    if(message.stateMatches(states)) {
      return message;
    }
  }
}

function hasBody() {
  var bodies = Array.prototype.slice.call(arguments);

  return function(message) {
    if(message.bodyMatches(bodies)) {
      return message;
    }
  }
}

function unhandled() {
  return function(message) {
    if(!message.handled) {
      return message;
    }
  }
}

function sendTimeIsInPast() {
  return function(message) {
    if(message.sendTimeIsInPast()) {
      return message;
    }
  }
}

module.exports = {
  hasState: hasState,
  sendTimeIsInPast: sendTimeIsInPast,
  hasBody: hasBody,
  unhandled: unhandled
};
