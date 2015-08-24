var debug = require('debug')('messages:out');
var util = require('util');
var Promise = require('bluebird');
var Message = require('./message').Message;

function BaseSender() {
}
BaseSender.prototype.send = function(message, store) {
  var self = this;
  return Promise.try(function() {
    return self._send(message)
  })
  .then(function(message) {
    return store.save(message);
  });
}

function DebugSender() {
}
util.inherits(DebugSender, BaseSender);

DebugSender.prototype._send = function(message) {
  message.state = Message.States.SENT;
  debug(message._debug());
  debug(message._user);
  return message;
}

function ConsoleSender() {
}
util.inherits(ConsoleSender, BaseSender);

ConsoleSender.prototype._send = function(message) {
  message.state = Message.States.SENT;
  console.log(message.body);
  return message;
}

module.exports = {
  BaseSender: BaseSender,
  DebugSender: DebugSender,
  ConsoleSender: ConsoleSender
};
