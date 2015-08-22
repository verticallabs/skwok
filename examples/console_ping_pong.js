var debug = require('debug')('app');
var messaging = require('../src/messaging');
var User = require('../src/user').User;
var Actions = messaging.Actions;
var Filters = messaging.Filters;

//PS - console ping pong lets you enter messages by typing into the console
//it will respond to help, ping, start, and stop.  if you stop it, it will not longer respond to ping, but it can be started again.

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
var receiver = new messaging.Receivers.Console('debug', function(message) {
  message.from = typist;
  message.to = app;

  //handle messages with this chain
  chain.handle(message);
});

//create a responder with debug channel
var responder = new messaging.Responders.Responder({
  debug: new messaging.Responders.Console()
});

//create the chain
var chain = new messaging.Chain(
  new messaging.Chain(
    Filters.unhandled(), 
    Filters.hasBody('help'), 
    Actions.respond('hi', responder),
    Actions.handled(),
    Actions.save(store)
  ),
  new messaging.Chain(
    Filters.unhandled(), 
    Filters.hasBody('stop'), 
    Actions.setFromState('stopped'),
    Actions.respond('stopping', responder),
    Actions.handled(),
    Actions.save(store)
  ),
  new messaging.Chain(
    Filters.unhandled(), 
    Filters.hasBody('start'), 
    Filters.hasFromState('stopped'), 
    Actions.setFromState('normal'),
    Actions.respond('starting', responder),
    Actions.handled(),
    Actions.save(store)
  ),
  new messaging.Chain(
    Filters.unhandled(), 
    Filters.hasBody('ping'), 
    Filters.hasFromState('normal'), 
    Actions.respond('pong', responder),
    Actions.handled(),
    Actions.save(store)
  )
);

