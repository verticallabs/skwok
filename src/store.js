var debug = require('debug')('store');
var util = require('util');
var _ = require('lodash');
var Promise = require('bluebird');

function Store() {
}

Store.prototype.save = function(message) {
  return Promise.try(function() {
    return this._save(message);
  }.bind(this));
}

Store.prototype.attachUser = function(message) {
  return Promise.try(function() {
    return this._attachUser(message);
  }.bind(this));
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
    return store.save(message)
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
