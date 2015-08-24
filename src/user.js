"use strict";

var _ = require("lodash");
var debug = require('debug')('user');

function User(attributes) {
  _.extend(this, attributes);
  if(!this.addresses || !_.keys(this.addresses).length) {
    throw new Error('user must have at least one address');
  }
}

User.prototype._stateMatches = function(strings) {
  var downcasedStrings = _.map(strings, function(s) { return s.toLowerCase(); });
  var downcasedState = _.trim(this.state.toLowerCase());
  return _.contains(downcasedStrings, downcasedState);
}

User.prototype._debug = function() {
  return _.pick(this, _.isString);
}

function setState(state) {
  return function(message) {
    message._user.state = state;
    return message;
  }
}

function hasState() {
  var states = Array.prototype.slice.call(arguments);

  return function(message) {
    if(message._user._stateMatches(states)) {
      return message;
    }
  }
}

User.Actions = {
  setState: setState 
};

User.Filters = {
  hasState: hasState
};

module.exports = {
  User: User
};
