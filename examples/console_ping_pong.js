var debug = require('debug')('app');
var skwok = require('../index');
var User = skwok.User;
var Message = skwok.Message;
var Store = skwok.Store;

console.log("console-ping-pong");
console.log("it will respond to help, ping, start, and stop.  if you stop it, it will not longer respond to ping, but it can be started again.");

//mock users and store
var typist = new User({
  name: 'Typist',
  state: 'normal',
  addresses: {
    debug: 'keyboard'
  } 
});
var store = new skwok.CustomStore({
  _save: function(message) {
    typist = message.user;
  },
  _attachUser: function(message) {
    message.user = typist;
    return message;
  }
});

//create a console receiver on debug channel
var receiver = new skwok.ChannelReceivers.ConsoleReceiver('debug', function(message) {
  //handle messages with this chain
  return chain.handle(message);
});

//create a sender with debug channel
var sender = new skwok.Sender({
  debug: new skwok.ChannelSenders.ConsoleSender()
});

//create the chain
var chain = new skwok.Chain(
  skwok.Store.Actions.attachUser(store),
  new skwok.Chain(
    Message.Filters.unhandled(), 
    Message.Filters.hasBody('help'), 
    Message.Actions.respond('hi', sender),
    Message.Actions.handled(),
    Store.Actions.save(store)
  ),
  new skwok.Chain(
    Message.Filters.unhandled(), 
    Message.Filters.hasBody('stop'), 
    User.Filters.hasState('normal'), 
    User.Actions.setState('stopped'),
    Message.Actions.respond('stopping', sender),
    Message.Actions.handled(),
    Store.Actions.save(store)
  ),
  new skwok.Chain(
    Message.Filters.unhandled(), 
    Message.Filters.hasBody('start'), 
    User.Filters.hasState('stopped'), 
    User.Actions.setState('normal'),
    Message.Actions.respond('starting', sender),
    Message.Actions.handled(),
    Store.Actions.save(store)
  ),
  new skwok.Chain(
    Message.Filters.unhandled(), 
    Message.Filters.hasBody('ping'), 
    User.Filters.hasState('normal'), 
    Message.Actions.respond('pong', sender),
    Message.Actions.handled(),
    Store.Actions.save(store)
  )
);

