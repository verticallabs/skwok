var streams = require('./src/streams');
var handlers = require('./src/handlers');
var responder = require('./src/responder');
var es = require('event-stream')

var messages = new streams.ConsoleStream(new responder.Responder());

process.stdin.pipe(messages)
  .pipe(new handlers.Debug())
  .pipe(new handlers.Help(['help']));
