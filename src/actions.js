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

function respond(body, responder) {
  var debug = require('debug')('action:respond');
  return function(message) {
    if(!responder) {
      throw new Error('no responder declared');
    }

    responder.send(new Message({
      to: message.from,
      from: message.to,
      body: body,
      channel: message.channel
    }));

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

function debugAction() {
  var debug = require('debug')('action:debug');
  return function(message) {
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
  debug: debugAction
};

