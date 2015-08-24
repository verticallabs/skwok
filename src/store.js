var debug = require('debug')('store');
var util = require('util');
var _ = require('lodash');
var Promise = require('bluebird');

function Store() {
}

Store.prototype.save = function(message) {
  var self = this;
  return Promise.try(function() {
    return self._save(message);
  });
}

Store.prototype.attachUser = function(message) {
  var self = this;
  return Promise.try(function() {
    return self._attachUser(message);
  });
}

function CustomStore(obj) {
  _.extend(this, obj);
}
util.inherits(CustomStore, Store);

function save(store) {
  if(!store) {
    throw new Error('no store');
  }

  return function(message) {
    return store.save(message);
  }
}

function attachUser(store) {
  if(!store) {
    throw new Error('no store');
  }

  return function(message) {
    return store.attachUser(message);
  }
}


Store.Actions = {
  save: save,
  attachUser: attachUser
};

module.exports = {
  Store: Store,
  CustomStore: CustomStore
};
