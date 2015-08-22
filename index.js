var debug = require('debug')('app');
var messaging = require('./src/messaging');
var consoleStream = require('./src/console_stream');

var typist, app;

var handler = new messaging.Chain(
  messaging.Actions.debug(),
  new messaging.Chain(
    messaging.Filters.hasBody('help'), 
    messaging.Actions.respond('hi'),
    messaging.Actions.handled() 
  ),
  new messaging.Chain(
    messaging.Filters.hasBody('stop'), 
    messaging.Actions.setFromState('stopped'),
    messaging.Actions.respond('stopping'),
    messaging.Actions.handled() 
  ),
  new messaging.Chain(
    messaging.Filters.hasBody('start'), 
    messaging.Filters.hasFromState('stopped'), 
    messaging.Actions.setFromState('normal'),
    messaging.Actions.respond('starting'),
    messaging.Actions.handled() 
  )
)

var responder = new messaging.Responder();
responder._send = function(message) {
  debug(message._debug());
  debug(message.to);
}

consoleStream.on('data', function(message) {
  typist = typist || message.from;
  app = app || message.to;

  message.from = typist;
  message.to = app;

  message.responder = responder;
  handler.handle(message);
});
