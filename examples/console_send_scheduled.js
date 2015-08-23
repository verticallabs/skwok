var debug = require('debug')('app');
var _ = require('lodash');
var time = require('../src/time');

var skwok = require('../index');
var User = skwok.User;
var Message = skwok.Message;

console.log('console-send-scheduled');
console.log('will respond to messages like "1 hi".  the number is the number of seconds to wait before sending the message');

//mock users
var typist = new User({
  name: 'Typist',
  state: 'normal',
  addresses: {
    debug: 'keyboard'
  } 
});
var messages = [];

//create a console receiver on debug channel
var receiver = new skwok.ChannelReceivers.ConsoleReceiver('debug', function(message) {
  message.user = typist;
  message.state = Message.States.PENDING;

  var add = Number(message.body.split(' ')[0]);
  message.sendTime = time.now().add(add, 's');
  messages.push(message);

});

//create a sender with debug channel
var sender = new skwok.Sender({
  debug: new skwok.ChannelSenders.ConsoleSender()
});

//create the chain
var chain = new skwok.Chain(
  Message.Filters.hasState(Message.States.PENDING), 
  Message.Filters.sendTimeIsInPast(),
  Message.Actions.send(sender)
);

//every second run each message through the chain
setInterval(function() {
  _.each(messages, function(message) {
    chain.handle(message);
  });
}, 1000);
