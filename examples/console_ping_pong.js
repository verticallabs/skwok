var debug = require('debug')('app');
var skwok = require('../index');
var User = skwok.User;
var Message = skwok.Message;

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
function store(message) {
  typist = message.user;
}

//create a console receiver on debug channel
var receiver = new skwok.ChannelReceivers.ConsoleReceiver('debug', function(message) {
  message.user = typist;

  //handle messages with this chain
  chain.handle(message);
});

//create a sender with debug channel
var sender = new skwok.Sender({
  debug: new skwok.ChannelSenders.ConsoleSender()
});

//create the chain
var chain = new skwok.Chain(
  new skwok.Chain(
    Message.Filters.unhandled(), 
    Message.Filters.hasBody('help'), 
    Message.Actions.respond('hi', sender),
    Message.Actions.handled(),
    Message.Actions.save(store)
  ),
  new skwok.Chain(
    Message.Filters.unhandled(), 
    Message.Filters.hasBody('stop'), 
    Message.Filters.hasUserState('normal'), 
    Message.Actions.setUserState('stopped'),
    Message.Actions.respond('stopping', sender),
    Message.Actions.handled(),
    Message.Actions.save(store)
  ),
  new skwok.Chain(
    Message.Filters.unhandled(), 
    Message.Filters.hasBody('start'), 
    Message.Filters.hasUserState('stopped'), 
    Message.Actions.setUserState('normal'),
    Message.Actions.respond('starting', sender),
    Message.Actions.handled(),
    Message.Actions.save(store)
  ),
  new skwok.Chain(
    Message.Filters.unhandled(), 
    Message.Filters.hasBody('ping'), 
    Message.Filters.hasUserState('normal'), 
    Message.Actions.respond('pong', sender),
    Message.Actions.handled(),
    Message.Actions.save(store)
  )
);

