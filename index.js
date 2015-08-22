var debug = require('debug')('app');
var messaging = require('./src/messaging');
var User = require('./src/user').User;
var consoleStream = require('./src/console_stream');

var typist = new User({
  name: 'Typist',
  addresses: {
    console: 'keyboard'
  } 
});
var app = new User({
  name: 'App',
  addresses: {
    console: 'cpu'
  } 
});

var responder = new messaging.Responder();
function store(message) {
  typist = message.from;
  app = message.to;
}

var handler = new messaging.Chain(
  messaging.Actions.debug(),
  new messaging.Chain(
    messaging.Filters.hasBody('help'), 
    messaging.Actions.respond('hi', responder),
    messaging.Actions.handled(),
    messaging.Actions.save(store)
  ),
  new messaging.Chain(
    messaging.Filters.hasBody('stop'), 
    messaging.Actions.setFromState('stopped'),
    messaging.Actions.respond('stopping', responder),
    messaging.Actions.handled(),
    messaging.Actions.save(store)
  ),
  new messaging.Chain(
    messaging.Filters.hasBody('start'), 
    messaging.Filters.hasFromState('stopped'), 
    messaging.Actions.setFromState('normal'),
    messaging.Actions.respond('starting', responder),
    messaging.Actions.handled(),
    messaging.Actions.save(store)
  )
)

responder._send = function(message) {
  debug(message._debug());
  debug(message.to);
}

consoleStream.on('data', function(message) {
  message.from = typist;
  message.to = app;
  handler.handle(message);
});
