"use strict"; 

var util = require('util');
var Duplex = require('stream').Duplex;
var Message = require('./../message').Message;

function ConsoleStream(responder) {
  this.responder = responder;
  Duplex.call(this, { objectMode: true });
}
util.inherits(ConsoleStream, Duplex);

ConsoleStream.prototype._read = function() {
}

ConsoleStream.prototype._write = function(chunk, encoding, done) {
  var message = new Message({ 
    state: Message.States.RECEIVED,
    type: Message.Types.INCOMING,
    body: chunk.toString().replace(/\s/g, ''),
    channel: Message.Channels.SMS,
    responder: this.responder
  });

  this.push(message);

  done();
}

module.exports = {
  ConsoleStream: ConsoleStream
};
