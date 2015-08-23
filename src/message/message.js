"use strict";

var _ = require("lodash");
var util = require('util');
var time = require('../time');

var States = {
  UNHANDLED: 'unhandled',
  RECEIVED: 'received',
  HANDLED: 'handled',
  PENDING: 'pending',
  SENDING: 'sending',
  SENT: 'sent',
  ERROR: 'error'
};

var Types = {
  INCOMING: 'incoming',
  OUTGOING: 'outgoing'
};

function Message(attributes) {
  _.extend(this, attributes);

  if(this.body === undefined) {
    throw new Error('Message must have body');
  }
}

Message.prototype.bodyMatches = function(strings) {
  var downcasedStrings = _.map(strings, function(s) { return s.toLowerCase(); });
  var downcasedBody = _.trim(this.body.toLowerCase());
  return _.contains(downcasedStrings, downcasedBody);
}

Message.prototype.stateMatches = function(strings) {
  var downcasedStrings = _.map(strings, function(s) { return s.toLowerCase(); });
  var downcasedState = _.trim(this.state.toLowerCase());
  return _.contains(downcasedStrings, downcasedState);
}

Message.prototype.sendTimeIsInPast = function() {
  return this.sendTime && this.sendTime.isBefore(time.now());
}

Message.prototype._debug = function() {
  var args = Array.prototype.slice.call(arguments);
  var debugObj = _.pick(this, 'body channel type state'.split(' ').concat(args))
  if(this.from) { 
    _.extend(debugObj, { from: this.from._debug() });
  }
  if(this.to) { 
    _.extend(debugObj, { to: this.to._debug() });
  }

  return debugObj;
}

Message.States = States;
Message.Types = Types;

module.exports = {
  Message: Message
};
