var debug = require('debug')('messages:out');
var util = require('util');

function BaseSender() {
}
BaseSender.prototype._send = function(message) {
  throw new Error('must implement _send');
}

function DebugSender() {
}
util.inherits(DebugSender, BaseSender);

DebugSender.prototype._send = function(message) {
  debug(message._debug());
  debug(message._user);
  return message;
}

function ConsoleSender() {
}
util.inherits(ConsoleSender, BaseSender);

ConsoleSender.prototype._send = function(message) {
  console.log(message.body);
  return message;
}

module.exports = {
  BaseSender: BaseSender,
  DebugSender: DebugSender,
  ConsoleSender: ConsoleSender
};
