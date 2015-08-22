var debug = require('debug')('app');
var messaging = require('../src/messaging');
var User = require('../src/user').User;

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
  handler.handle(message);
});

//create a responder with debug channel
var responder = new messaging.Responders.Responder({
  debug: new messaging.Responders.Debug()
});

//create the chain
var handler = new messaging.Chain(
  new messaging.Chain(
    messaging.Filters.unhandled(), 
    messaging.Filters.hasBody('help'), 
    messaging.Actions.respond('hi', responder),
    messaging.Actions.handled(),
    messaging.Actions.save(store)
  ),
  new messaging.Chain(
    messaging.Filters.unhandled(), 
    messaging.Filters.hasBody('stop'), 
    messaging.Actions.setFromState('stopped'),
    messaging.Actions.respond('stopping', responder),
    messaging.Actions.handled(),
    messaging.Actions.save(store)
  ),
  new messaging.Chain(
    messaging.Filters.unhandled(), 
    messaging.Filters.hasBody('start'), 
    messaging.Filters.hasFromState('stopped'), 
    messaging.Actions.setFromState('normal'),
    messaging.Actions.respond('starting', responder),
    messaging.Actions.handled(),
    messaging.Actions.save(store)
  ),
  new messaging.Chain(
    messaging.Filters.unhandled(), 
    messaging.Filters.hasBody('ping'), 
    messaging.Filters.hasFromState('normal'), 
    messaging.Actions.respond('pong', responder),
    messaging.Actions.handled(),
    messaging.Actions.save(store)
  )
);

