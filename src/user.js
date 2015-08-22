"use strict";

var _ = require("lodash");

function User(attributes) {
  this.state = '';
  _.extend(this, attributes);
  if(!this.addresses || !_.keys(this.addresses).length) {
    throw new Error('user must have at least one address');
  }
}

User.prototype.stateMatches = function(strings) {
  var downcasedStrings = _.map(strings, function(s) { return s.toLowerCase(); });
  var downcasedState = _.trim(this.state.toLowerCase());
  return _.contains(downcasedStrings, downcasedState);
}

User.prototype._debug = function() {
  return _.pick(this, _.isString);
}

module.exports = {
  User: User
};
