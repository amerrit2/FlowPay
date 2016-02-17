


var Promise = require('bluebird');
var _       = require('lodash');
var Logger  = require('./logger.js');
var Transaction = require('./transaction/transaction.js');
var Network     = require('./network.js');
var Blockchain  = require('./blockchain.js');
var Lock        = require("./transaction/lock.js");
var OutPoint    = require("./transaction/outpoint.js");

var logger = new Logger('CLIENT'); 

var Client = module.exports = function(args){

  this.d_name           = args.name;
  this.d_freeValue      = args.startingValue;
  this.d_closeableValue = 0;
  this.d_lockedValue    = 0;
  this.d_channels       = [];
  this.d_id             = _.uniqueId();  

};

Client.prototype.getName = function(){

  return this.d_name;
};

Client.prototype.toString = function(){

  return "Client[\n\tname: " + this.d_name  +
    "\n\tfreeValue: " + this.d_freeValue + 
    "\n\tcloseableValue: " + this.d_closeableValue +
    "\n\tlockedValue: " + this.d_lockedValue +
    "\n\tchannels: " + this.d_channels.length +
    "\n\tid: " + this.d_id;
};

Client.prototype.sendValue = function(to, amount){
  
  var bc = Blockchain.get();
  if(bc.getClientValue(this) >= amount){
    
    var outPoints        = bc.getUnspentsOutPoints(this),
        outPointsToSpend = [],
        outValue         = 0;
        
    _.forEach(outPoints, function(outPoint){
      outPointsToSpend.push((outPoint));
      outValue += outPoint.getValue();
      if(outValue >= amount){
        return false; //force exit
      }
    }.bind(this));
    
  /*  logger.debug("total outs: " + outPoints.length + 
      " | needed to spend: " + outPointsToSpend.length);*/
    
    var txOuts = [new OutPoint({
      value: amount,
      lock: new Lock({clients: [to]})
    })];
    
    //Spend change back
    if(outValue > amount){
      txOuts.push(new OutPoint({
        value: (outValue - amount),
        lock: new Lock({clients: [this]})
      }));
    }
    
    //Create transaction
    var tran = new Transaction({
      tx_ins: outPointsToSpend,
      tx_outs: txOuts,
      lock_time: null
    });
    
    //send to blockchain
    bc.promiseProcessTransaction(tran)
    .then(function(){
      logger.debug("Transaction processed!");
    })
    .error(function(error){
      logger.error("Failed to process transaction. error=" + error.message);
    });
    
    
  }else{
    
    logger.error("Client does not have enough value to send.");
  }
  
};

Client.prototype.promiseOpenChannelTo = function(value, downstreamClient){
  return new Promise(function(accept, reject){
    console.log(this.getName() + " attempting to open channel to " + downstreamClient.getName() + " | value: " + value);
    if(value > this.d_freeValue){
      reject(Promise.RejectionError("Not enough free value to open channel for " + this.d_name));
    }else if(this === downstreamClient){
      reject(Promise.RejectionError("Client cannot open channel to itself"));
    }else{
      var openChannelTransaction = new Transaction({
        inputTrans: null,
        locks: [
          this,
          downstreamClient
        ],
        value: value
      });

      downstreamClient.promiseOpenChannelFrom(openChannelTransaction, this)
      .then(function(refundTrans){
        if(refundTrans.isLockedBy([this]) &&
            refundTrans.getValue() === value &&
            refundTrans.getInputTransaction() === openChannelTransaction){

          Network.createChannel({
            openChannelTransaction: openChannelTransaction,
            refundTrans:     refundTrans,
            upstream:    this,
            downstreamClient:  downstreamClient
          });

          accept("Channel submitted to network");
        }else{
          logger.error("Refund transaction invalid. Trans = " + refundTrans.toString());
          reject(Promise.RejectionError("Refund not locked properly"));
        }
      }.bind(this))
      .error(function(error){
        logger.error("Downstream Client failed to create refund trans. error=" + error.message);
        reject(error);
      });
    }
  }.bind(this));
};

Client.prototype.promiseOpenChannelFrom = function(openTransaction, upstreamClient){
  return new Promise(function(accept, reject){
    if(!openTransaction.isValid()){
      reject(Promise.RejectionError("Invalid open transaction"));
    }else if(!openTransaction.isLockedBy([this, upstreamClient])){
      reject(Promise.RejectionError("openTransaction not locked properly. locks=" + openTransaction.getLockNames()));
    }else{
      var refundTrans = new Transaction({
        inputTrans: openTransaction,
        locks: [upstreamClient],
        value: openTransaction.getValue()
      });
      accept(refundTrans);      
    }
  }.bind(this));
};
