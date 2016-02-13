
var _ = require('lodash');
var Logger = require('../logger.js');
var Guid   = require('node-uuid');
var Assert = require('assert-plus');
var OutPoint = require('./outpoint.js');
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
  
  Assert.ok(args.tx_ins instanceof Array || !args.tx_ins, "args.tx_ins incorrect type!");
  Assert.array(args.tx_outs, "args.tx_outs must be an Array!");

  this.d_tx_ins     = args.tx_ins; 
  this.d_tx_outs    = args.tx_outs;
  this.d_lock_time  = args.lock_time;
  this.d_id         = Guid.v4();
  
};

Transaction.prototype.getTxOuts = function(){
  return this.d_tx_outs;
};
Transaction.prototype.getTxIns = function(){
  return this.d_tx_ins;
}

Transaction.prototype.spendsOutPoint = function(outPoint){
    return (_.indexOf(this.d_tx_ins, outPoint) > -1);
};

Transaction.prototype.getId = function(){
  return this.d_id;
};

Transaction.prototype.isValid    = function(){
  
  var inValue = 0;
  _.forEach(this.d_tx_ins, function(outPoint){
    inValue += outPoint.getValue();
  });
  var outValue = 0;
  _.forEach(this.d_tx_outs, function(outPoint){
    outValue += outPoint.getValue();
  });

  return (_.isNull(this.d_tx_ins) || (inValue === outValue));
};
 
 