'use strict'

var debug = require("debug")('responder');

function Responder() {
}

Responder.prototype.respond = {};
Responder.prototype.respond.text = function(text) { 
  debug('text: ' + text);
}

Responder.prototype.respond.template = function(templateName, data) { 
  debug('template: ' + templateName);
  debug(data);
}

module.exports = {
  Responder: Responder
}

