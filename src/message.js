"use strict";

var _ = require("lodash");

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

function Message(options) {
  options = options || {};

  this.respond = options.responder.respond;

  this.state = options.state || null;
  this.type = options.type || null;
  this.body = options.body || '';
  this.from = options.from || null;
  this.to = options.to || null;
  this.channel = options.channel || null;
}

Message.prototype.matches = function(text) {
  var lcBody = _.trim(this.body.toLowerCase());
  var lcText = _.trim(text.toLowerCase());
  return lcBody == lcText;
}

Message.States = States;
Message.Types = Types;
Message.Channels = Channels;

module.exports = {
  Message: Message
};
