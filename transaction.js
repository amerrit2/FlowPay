
var _ = require('lodash');
var Logger = require('./logger.js');

var logger = new Logger("TRANSACTION");

var Transaction = module.exports = function(args){

  this.d_inputTrans = args.inputTrans;
  this.d_locks      = args.locks;
  this.d_value       = args.value;
  
};

Transaction.prototype.getInputTransaction = function(){

  return this.d_inputTrans;
}; 
Transaction.prototype.getValue      = function(){
  return this.d_value;

};

Transaction.prototype.isValid    = function(){
  return (this.d_inputTrans === null || 
      this.d_value === this.d_inputTrans.value)
};
 
Transaction.prototype.isLockedBy = function(locks){
  if(locks && locks.length === this.d_locks.length){
    var missingLock = false;
    _.forEach(this.d_locks, function(myLock){
      if(locks.indexOf(myLock) === -1){
        missingLock = true;
      }
    });
    return !missingLock;
  }else{
    logger.trace("Lock arrays different lengths");
    return false;
  }

};

Transaction.prototype.getLockNames = function(){
  var names = "[";
  _.forEach(this.d_locks, function(lock){
    names += lock.getName();
    if(lock !== this.d_locks[this.d_locks.length-1]){
      names+= ",";
    }
  }.bind(this));
  names += "]";
  return names;
};
