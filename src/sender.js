var debug = require('debug')('messages:out');
var util = require('util');
var _ = require('lodash');
var Message = require('./message').Message;
var Promise = require('bluebird');

function Sender(channels) {
  this.channels = channels;
}

Sender.prototype.send = function(message, store) {
  message.type = Message.Types.OUTGOING;
  message.state = Message.States.SENDING;

  if(!message.channel) {
    throw new Error('message has no channel');
  }

  var channelSender = this.channels[message.channel];
  if(!channelSender) {
    throw new Error('no responder for channel: ' + message.channel);
  }

  if(!message._user) {
    throw new Error('no recipient for message');
  }
  message.address = message._user.addresses[message.channel];

  if(!message._user.addresses[message.channel]) {
    throw new Error('no address for recipient on channel ' + message.channel);
  }
  
  message.state = Message.States.SENDING;
  return Promise.try(function() {
    return channelSender.send(message, store);
  });
}

module.exports = {
  Sender: Sender,
};
