"use strict";

var _ = require('lodash');
var Emitter = require('events').EventEmitter;
var States = require('./message').States;
var util = require('util');

function MessageHandler() {
  var args = Array.prototype.slice.call(arguments);
  this.filterRegex = args[0];
  this.subHandlers = args.slice(1) || [];
}
util.inherits(MessageHandler, Emitter);

MessageHandler.prototype.handleMessage = function(message, respond) {
  var filterRegex = this.filterRegex;

  _.each(this.subHandlers, function(subHandler) {
    if(message.state != States.HANDLED && filterRegex.test(message.state)) {
      subHandler(message, respond);
    }
  });

  return this;
}

module.exports = {
  MessageHandler: MessageHandler
};
