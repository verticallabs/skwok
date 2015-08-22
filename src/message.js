"use strict";

var _ = require("lodash");
var util = require('util');

var States = {
  UNHANDLED: 'unhandled',
  RECEIVED: 'received',
  HANDLED: 'handled',
  SENDING: 'sending',
  SENT: 'sent',
  ERROR: 'error'
};

var Types = {
  INCOMING: 'incoming',
  OUTGOING: 'outgoing'
};

var Channels = {
  SMS: 'sms',
  EMAIL: 'email'
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

Message.prototype._debug = function() {
  var debugObj = _.pick(this, 'body channel type state'.split(' '))
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
Message.Channels = Channels;

module.exports = {
  Message: Message
};
