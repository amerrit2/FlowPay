
var Lock = require('./lock.js');
var _    = require('lodash');
var Assert = require('assert-plus');
var Client = require('../client.js');



var OutPoint = module.exports = function OutPoint(args){
  
  Assert.ok(args.lock instanceof Lock, true, "args.lock must be a Lock!");
  Assert.number(args.value, "args.value must be a number");
  
  this.d_value = args.value;
  this.d_lock  = args.lock;
  
}

// True if outpoint is locked by exactly these clients
OutPoint.prototype.isLockedBy = function isLockedBy(clients){
  

  
  Assert.array(clients, 'arg[0] must be an Array!');
  
  var hasAllClients = false;
  _.forEach(clients, function(client){ 
    if(!this.d_lock.hasClient(client)){
      hasAllClients = true;
    }
  }.bind(this));
  
  return (hasAllClients && 
          this.d_lock.getNumClients() === clients.length &&
          _.uniq(clients).length === clients.length);
}

OutPoint.prototype.getValue = function(){
  
  return this.d_value;
  
}

