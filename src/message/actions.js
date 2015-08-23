var util = require('util');
var _ = require('lodash');
var Message = require('./message').Message;

function save(storeFn) {
  var debug = require('debug')('action:save');
  return function(message) {
    storeFn(message);
    return message;
  }
}

function respond(body, sender) {
  var debug = require('debug')('action:respond');
  return function(message) {
    if(!sender) {
      throw new Error('no senderdeclared');
    }

    sender.send(new Message({
      to: message.from,
      from: message.to,
      body: body,
      channel: message.channel
    }));

    return message;
  }
}

function send(sender) {
  var debug = require('debug')('action:send');
  return function(message) {
    if(!sender) {
      throw new Error('no responder declared');
    }

    sender.send(message);
    return message;
  }
}


function setFromState(state) {
  var debug = require('debug')('action:setFromState');
  return function(message) {
    message.from.state = state;
    return message;
  }
}

function debugAction(name) {
  var debug = require('debug')('action:debug');
  return function(message) {
    if(name) { 
      debug(name); 
    }
    debug(message._debug());
    return message;
  }
}

function handled() {
  var debug = require('debug')('action:handled');
  return function(message) {
    message.state = Message.States.HANDLED;
    return message;
  }
}

module.exports = {
  respond: respond,
  setFromState: setFromState,
  handled: handled,
  save: save,
  send: send,
  debug: debugAction
};

