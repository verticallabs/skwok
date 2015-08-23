var debug = require('debug')('messages:out');
var util = require('util');
var _ = require('lodash');
var Message = require('./message').Message;
var Promise = require('bluebird');

function Sender(channels) {
  this.channels = channels;
}

Sender.prototype.send = function(message) {
  message.type = Message.Types.OUTGOING;
  message.state = Message.States.SENDING;

  if(!message.channel) {
    throw new Error('message has no channel');
  }

  var channelSender = this.channels[message.channel];
  if(!channelSender) {
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
  
  message.state = Message.States.SENDING;
  return Promise.try(function() {
    return channelSender._send(message);
  });
}

module.exports = {
  Sender: Sender,
};
