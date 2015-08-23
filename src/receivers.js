var util = require('util');
var Writable = require('stream').Writable;
var Message = require('./message').Message;
var debug = require('debug')('receivers');

function Receiver(channel, _receive) {
  this.channel = channel;
  this._receive = _receive;
}

Receiver.prototype.receive = function(message) {
  message.type = Message.Types.INCOMING;
  this._receive(message);
}

function ConsoleReceiver(channel, _receive) {
  Receiver.call(this, channel, _receive);
  Writable.call(this, { objectMode: true });

  this.debug = require('debug')('messages:in');
  process.stdin.pipe(this);
}
util.inherits(ConsoleReceiver, Writable);

ConsoleReceiver.prototype.receive = function(message) {
  this.debug(message._debug());
  this._receive(message);
} 

ConsoleReceiver.prototype._write = function(chunk, encoding, done) {
  var string = chunk.toString().replace(/\s*$/g, '');
  if(!string) {
    return done();
  }

  var message = new Message({ 
    state: Message.States.RECEIVED,
    body: string,
    channel: this.channel
  });

  this.receive(message);

  done();
}

module.exports = {
  Receiver: Receiver,
  Console: ConsoleReceiver
}
