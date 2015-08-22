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
  this.fns = Array.prototype.slice.call(arguments);
}

Chain.prototype.handle = function(message) {
  //PS - a chain will run until the message is not returned
  //at the end of the chain it will return the message if it was not handled
  return Promise.reduce(this.fns, function(m, fn) {
    if(!m) {
      return null;
    }

    if(typeof fn == 'object') {
      return fn.handle(m); 
    }
    else if(typeof fn == 'function') {
      return fn(m);
    }
  }, message)
    .then(function() {
      if(message.state !== Message.States.HANDLED) {
        return message;
      }
    })
}

module.exports = {
  Message: Message,
  Responder: Responder,
  Chain: Chain,
  Filters: require('./filters'),
  Actions: require('./actions')
};
