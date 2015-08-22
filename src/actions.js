var debug = require('debug')('actions');
var util = require('util');
var _ = require('lodash');
var Message = require('./message').Message;

function save(storeFn) {
  return function(message) {
    storeFn(message);
    return message;
  }
}

function respond(body, responder) {
  return function(message) {
    debug('respond');

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
  return function(message) {
    debug('setFromState');

    message.from.state = state;
    return message;
  }
}

function debugAction() {
  return function(message) {
    debug('debug');

    debug(message._debug());
    return message;
  }
}

function handled() {
  return function(message) {
    message.state = Message.States.handled;
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

