"use strict"; 

var util = require('util');
var Duplex = require('stream').Duplex;
var Message = require('./message').Message;
var User = require('./user').User;

function ConsoleStream() {
  Duplex.call(this, { objectMode: true });
  process.stdin.pipe(this);
}
util.inherits(ConsoleStream, Duplex);

ConsoleStream.prototype._read = function() {
}

ConsoleStream.prototype._write = function(chunk, encoding, done) {
  var string = chunk.toString().replace(/\s/g, '');
  if(!string) {
    return done();
  }

  var message = new Message({ 
    state: Message.States.RECEIVED,
    type: Message.Types.INCOMING,
    body: string,
    channel: 'console',
    from: new User({
      name: 'Typist',
      addresses: {
        console: 'keyboard'
      } 
    }),
    to: new User({
      name: 'App',
      addresses: {
        console: 'cpu'
      } 
    }),
  });
  this.push(message);

  done();
}

module.exports = new ConsoleStream();
