var debug = require('debug')('messaging');
var util = require('util');
var _ = require('lodash');
var Promise = require("bluebird");
var Message = require('./message').Message;
var User = require('./user').User;

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
  User: User,
  Chain: Chain,
  Senders: require('./senders'),
  Receivers: require('./receivers'),
  Filters: require('./filters'),
  Actions: require('./actions')
};
