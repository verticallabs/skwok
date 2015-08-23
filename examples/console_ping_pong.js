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
var app = new User({
  name: 'App',
  state: 'normal',
  addresses: {
    debug: 'app'
  } 
});
function store(message) {
  typist = message.from;
  app = message.to;
}

//create a console receiver on debug channel
var receiver = new skwok.Receivers.Console('debug', function(message) {
  message.from = typist;
  message.to = app;

  //handle messages with this chain
  chain.handle(message);
});

//create a sender with debug channel
var sender = new skwok.Senders.Sender({
  debug: new skwok.Senders.Console()
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
    Message.Actions.setFromState('stopped'),
    Message.Actions.respond('stopping', sender),
    Message.Actions.handled(),
    Message.Actions.save(store)
  ),
  new skwok.Chain(
    Message.Filters.unhandled(), 
    Message.Filters.hasBody('start'), 
    Message.Filters.hasFromState('stopped'), 
    Message.Actions.setFromState('normal'),
    Message.Actions.respond('starting', sender),
    Message.Actions.handled(),
    Message.Actions.save(store)
  ),
  new skwok.Chain(
    Message.Filters.unhandled(), 
    Message.Filters.hasBody('ping'), 
    Message.Filters.hasFromState('normal'), 
    Message.Actions.respond('pong', sender),
    Message.Actions.handled(),
    Message.Actions.save(store)
  )
);

