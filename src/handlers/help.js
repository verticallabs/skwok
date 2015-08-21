var debug = require('debug')('handlers:help');
var Combine = require('stream-combiner');
var es = require('event-stream')
var FilterHandler = require('./filter');

function HelpHandler(strings, response) {
  return Combine(
    new FilterHandler(strings),
    es.map(function(message, done) {
      message.respond.text('ok');
      done();
    })
  );
}

module.exports = HelpHandler; 
