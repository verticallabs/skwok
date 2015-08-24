var debug = require('debug')('message:actions');
var util = require('util');
var _ = require('lodash');
var Message = require('./message').Message;

function respond(body, sender, store) {
  return function(message) {
    debug('respond');
    debug(message);
    if(!sender) {
      throw new Error('no senderdeclared');
    }

    sender.send(new Message({
      _user: message._user,
      body: body,
      channel: message.channel,
    }), store);

    return message;
  }
}

function send(sender, store) {
  return function(message) {
    if(!sender) {
      throw new Error('no responder declared');
    }

    return sender.send(message, store)
      .then(function() {
        return message;
      });
  }
}


function debugAction(name) {
  var debug = require('debug')('messages:debug');
  return function(message) {
    if(name) { 
      debug(name); 
    }
    debug(message._debug());
    return message;
  }
}

function handled() {
  return function(message) {
    message.state = Message.States.HANDLED;
    return message;
  }
}

module.exports = {
  respond: respond,
  handled: handled,
  send: send,
  debug: debugAction
};

