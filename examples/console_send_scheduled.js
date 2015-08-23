var debug = require('debug')('app');
var _ = require('lodash');
var time = require('../src/time');
var messaging = require('../src/messaging');
var User = require('../src/user').User;
var Actions = messaging.Actions;
var Filters = messaging.Filters;
var Message = messaging.Message;

console.log('console-send-scheduled');
console.log('will respond to messages like "1 hi".  the number is the number of seconds to wait before sending the message');

//mock users and store
var typist = new User({
  name: 'Typist',
  state: 'normal',
  addresses: {
    debug: 'keyboard'
  } 
});
var app = new User({
  name: 'App',
  state: 'normal',
  addresses: {
    debug: 'app'
  } 
});

var messages = [];

//create a console receiver on debug channel
var receiver = new messaging.Receivers.Console('debug', function(message) {
  message.from = typist;
  message.to = app;
  message.state = Message.States.PENDING;

  var add = Number(message.body.split(' ')[0]);
  message.sendTime = time.now().add(add, 's');
  messages.push(message);

});

//create a sender with debug channel
var sender = new messaging.Senders.Sender({
  debug: new messaging.Senders.Console()
});

//create the chain
var chain = new messaging.Chain(
  Filters.hasState(Message.States.PENDING), 
  Filters.sendTimeIsInPast(),
  Actions.debug(),
  Actions.send(sender)
);

setInterval(function() {
  _.each(messages, function(m) { 
    debug(m.body + ' ' + m.state + ' ' + m.sendTime.format()); 
  });

  _.each(messages, function(message) {
    //handle messages with this chain
    chain.handle(message);
  });
}, 1000);
