

var Promise     = require('bluebird');
var Lock        = require('./transaction/lock.js');
var _           = require('lodash');
var Transaction = require('./transaction/transaction.js');
var Logger      = require('./logger.js');
var OutPoint    = require('./transaction/outpoint.js');
var Assert      = require("assert-plus");


var logger      = new Logger("Blockchain");



var Blockchain = function(args){

	this.d_transactions    = [];
	this.d_isInitialzed    = false;

};

Blockchain.prototype.initialize = function(args){
	//Set up initial genesis transactions
	_.forEach(args.initTransactionInfos, function(transInfo){
		var transaction = new Transaction({
			tx_ins:   null,
			tx_outs:   [new OutPoint({
				value: transInfo.value,
				lock: new Lock({clients: [transInfo.client] } )
			})],
			lock_time: null,
		});
		if(!transaction.isValid()){
			logger.error("Invalid transaction info: " + JSON.stringify(transInfo));
		}else{
			this.d_transactions.push(transaction);
		}
	}.bind(this));	
	
	this.d_isInitialzed = true;
}

Blockchain.prototype.getClientValue = function(client){

	var unspentValue = 0;
	_.forEach(this.d_transactions, function(transaction){
		_.forEach(transaction.getTxOuts(), function(outPoint){
		  
			
			if(outPoint.isLockedBy([client]) &&
			   this.checkOutPointIsUnspent(outPoint)){
			   	
				unspentValue += outPoint.getValue();
			}
		}.bind(this))
	}.bind(this));
	return unspentValue;
};

Blockchain.prototype.getUnspentsOutPoints = function(client){
	
	var spendableOutPoints = [];
	_.forEach(this.d_transactions, function(transaction){
		_.forEach(transaction.getTxOuts(), function(outPoint){
			if(outPoint.isLockedBy([client]) &&
			   this.checkOutPointIsUnspent(outPoint)){
			  spendableOutPoints.push(outPoint);   	
			}
		}.bind(this));
	}.bind(this));
	
	return spendableOutPoints;
};

Blockchain.prototype.checkOutPointIsUnspent = function(outPoint){
	Assert.ok(outPoint instanceof OutPoint, "args[0]");
	
	var alreadySpent = false;
	_.forEach(this.d_transactions, function(transaction){
		if(transaction.spendsOutPoint(outPoint)){
			alreadySpent = true;
		}
	});
	
	return !alreadySpent;
}



Blockchain.prototype.promiseProcessTransaction = function(transaction){
	
	if(!(transaction instanceof Transaction)){
		throw new Error("processTransaction(Transaction t) invalid t");
	}

	return new Promise(function(accept, reject){
	  var valid = true;
	  _.forEach(transaction.getTxOuts(), function(outPoint){
	    if(!this.checkOutPointIsUnspent(outPoint)){
	      valid = false;
	    }
	  }.bind(this));
	  
	  if(valid && transaction.isValid()){
	    this.d_transactions.push(transaction);
	    accept();
	  }else{
	    var error = new Promise.RejectionError();
	    error.message = "Invalid transaction, cannot add"
	    reject(error);
	  }
		
	}.bind(this));

};

var blockchainSingleton = new Blockchain();

module.exports = {
	
	initialize: function(args){
		if(blockchainSingleton.d_isInitialzed){
			return false;
		}else{
			blockchainSingleton.initialize(args);
			return true;
		}
	},
	get: function(){
		return blockchainSingleton;
	}
}
