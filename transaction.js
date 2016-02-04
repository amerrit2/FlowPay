
var _ = require('lodash');
var Logger = require('./logger.js');
var Guid   = require('node-uuid');

var logger = new Logger("TRANSACTION");

/*
  new Transaction({
    tx_ins: [
      {
        tx:       {Transaction}, 
        outIndex: {Number}
      }
    ],
    tx_outs: [
      {
        lock:    {Lock}, 
        value:   {Number}
      }
    ],
    lock_time: {Date}

  });

 */
var Transaction = module.exports = function(args){

  this.d_tx_ins     = args.tx_ins; 
  this.d_tx_outs    = args.tx_outs;
  this.d_lock_time  = args.lock_time;
  this.d_id         = Guid.v4();
  
};

Transaction.prototype.getTxOuts = function(){
  return this.d_tx_outs;
};

Transaction.prototype.getId = function(){
  return this.d_id;
};

Transaction.prototype.isValid    = function(){
  
  var inValue = 0;
  _.forEach(this.d_tx_ins, function(txIn){
    inValue += outPoint.tx.getOutputValue(outPoint.outIndex);
  });
  var outValue = 0;
  _.forEach(this.d_tx_outs, function(txOut){
    outValue += txOut.value;
  });

  return (_.isNull(this.d_tx_ins) || inValue === outValue);
};
 
Transaction.prototype.isLockedBy = function(index, clients){

  if(!_.isNumber(index)){
    throw new Error("index must be a number");
  }
  if(!_.isArray(clients)){
    throw new Error("clients must be an array");
  }

  return (_.isObject(this.d_tx_outs[index])  && 
      this.d_tx_outs[index].lock.isLockedBy(clients));
  
};

Transaction.prototype.getLockNames = function(){
  var names = "[";
  _.forEach(this.d_tx_outs, function(txOut){
    names += txOut.lock.getNames();
    if(txOut !== this.d_tx_outs[this.d_tx_outs.length-1]){
      names+= ",";
    }
  }.bind(this));
  names += "]";
  return names;
};
