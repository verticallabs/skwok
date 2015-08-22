var debug = require('debug')('messages:out');
var util = require('util');
var _ = require('lodash');
var Message = require('./message').Message;

function Responder(channels) {
  this.channels = channels;
}

Responder.prototype.send = function(message) {
  message.type = Message.Types.OUTGOING;
  message.state = Message.States.SENDING;

  if(!message.channel) {
    throw new Error('message has no channel');
  }

  var channelResponder = this.channels[message.channel];
  if(!channelResponder) {
    throw new Error('no responder for channel: ' + message.channel);
  }

  var to = message.to;
  if(!to) {
    throw new Error('no recipient for message');
  }

  var address = to.addresses[message.channel]; 
  if(!address) {
    throw new Error('no address for recipient on channel ' + message.channel);
  }
  channelResponder._send(message);
}

function DebugResponder() {
}
util.inherits(DebugResponder, Responder);

DebugResponder.prototype._send = function(message) {
  debug(message._debug());
  debug(message.to);
}

module.exports = {
  Responder: Responder,
  Debug: DebugResponder 
};
