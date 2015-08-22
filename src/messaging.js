var debug = require('debug')('messaging');
var util = require('util');
var _ = require('lodash');
var Promise = require("bluebird");
var Message = require('./message').Message;

function Responder() {
}
Responder.prototype.send = function(message) {
  message.type = Message.Types.OUTGOING;
  message.state = Message.States.SENDING;
  this._send(message);
}

function Chain() {
  this.subHandlers = Array.prototype.slice.call(arguments);
}

Chain.prototype.handle = function(message) {
  //a chain will effectively stop after failing filters 
  //a chain will always return the message
  return Promise.reduce(this.subHandlers, function(m, h) {
    if(!m) {
      return;
    }

    if(h instanceof Chain) {
      return h.handle(m); 
    }
    else if(typeof h == 'function') {
      return h(m);
    }
    else {
      throw new Error('bad object in chain: ' + util.inspect(h));
    }
  }, message)
    .then(function() {
      return message;
    })
}

module.exports = {
  Message: Message,
  Responder: Responder,
  Chain: Chain,
  Responders: require('./responders'),
  Receivers: require('./receivers'),
  Filters: require('./filters'),
  Actions: require('./actions')
};
