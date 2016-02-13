

var Promise     = require('bluebird');
var Lock        = require('./transaction/lock.js');
var _           = require('lodash');
var Transaction = require('./transaction/transaction.js');
var Logger      = require('./logger.js');
var OutPoint    = require('./transaction/outpoint.js');
var Assert      = require("assert-plus");

var logger      = new Logger("Blockchain");


var Blockchain = module.exports = function(args){

	this.d_transactions    = [];

	//Set up initial genesis transactions
	_.forEach(args.initTransactionInfos, function(transInfo){
		var transaction = new Transaction({
			tx_ins:   null,
			tx_outs:   [new OutPoint({
				value: transInfo.value,
				lock: new Lock({clients: [transInfo.client]})
			})],
			lock_time: null,
		});
		if(!transaction.isValid()){
			logger.error("Invalid transaction info: " + JSON.stringify(transInfo));
		}else{
			this.d_transactions.push(transaction);
		}
	}.bind(this));
	
};


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
		if(transaction.isValid()){
			if(transaction.lock_time < Date.now()){
				reject(Promise.RejectionError(
					"Transaction is still locked. lock_time=" + 
							transaction.lock_time));
			}else{
				
			}
		}else{
			reject(Promise.RejectionError("Transaction is invalid"));
		}
	
	}.bind(this));

};
