'use strict'; /* jshint -W079 */
var EventEmitter = require('events');
var util = require('util');
var WebSocket = require('ws');

function extend(target, object) {
  for(var i = 0, keys = Object.keys(object), len = keys.length; i < len; i++) {
    target[keys[i]] = object[keys[i]];
  }
  return target;
}

function TogglEvents(options) {
  EventEmitter.call(this, options);

  this.options = options || {};
  this.connect();
  if(this.options.token) {
    this.authenticate();
  }
}
util.inherits(TogglEvents, EventEmitter);

TogglEvents.prototype.connect = function(options) {
  if(this.ws) {
    this.ws.close();
    this.emit('close', this.ws);
  }

  var defaultOptions = extend({}, this.options);
  options = extend(defaultOptions, options || {});

  this.ws = new WebSocket(options.url || 'wss://stream.toggl.com/ws', {
    origin: options.origin || 'https://toggl.com',
  });

  this.emit('connect', this.ws);

  var _this = this;

  this.ws.on('open', function() {
    _this.emit('open', _this.ws);
  });

  this.ws.on('error', function(err) {
    _this.emit('error', err);
  });

  this._authenticated = false;

  this.ws.on('message', function(msg) {
    msg = JSON.parse(msg);
    if(msg.session_id != null) {
      _this._authenticated = true;
      _this.emit('authenticated', msg);
    } else if(msg.type === 'ping') {
      _this.send({
        type: 'pong'
      });
      _this.emit('ping');
    } else {
      _this.emit('message', msg);
    }
  });
};

TogglEvents.prototype.authenticate = function(token) {
  if(!token) {
    token = this.options.token;
  }

  this.send({
    type: 'authenticate',
    api_token: token,
  });
};

TogglEvents.prototype.send = function(msg) {
  if(!this.isConnected()) {
    var _this = this;
    this.ws.once('open', function() {
      _this.send(msg);
    });
    return;
  }

  this.emit('send', msg);
  this.ws.send(JSON.stringify(msg));
};

TogglEvents.prototype.isConnected = function() {
  return this.ws.readyState === WebSocket.OPEN;
};

TogglEvents.prototype.isAuthenticated = function() {
  return this.isConnected() && this._authenticated;
};

TogglEvents.onMessage = function(onMessage, options) {
  if(typeof options === 'string') {
    options = { token: options };
  } else if(options == null) {
    options = { token: process.env.TOGGL_API_TOKEN };
  }

  var togglEvents = new TogglEvents(options);
  togglEvents.on('message', onMessage);
};

exports = module.exports = TogglEvents;
