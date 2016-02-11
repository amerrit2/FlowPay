

var Promise     = require('bluebird');
var Lock        = require('./lock.js');
var _           = require('lodash');
var Transaction = require('./transaction.js');


var Blockchain = module.exports = function(args){

	this.d_transactions    = [];

	//Set up initial genesis transactions
	_.forEach(args.initTransactionInfos, function(transInfo){
		var transaction = new Transaction({
			tx_ins:   null,
			tx_outs:   [{
				value: transInfo.value,
				lock: new Lock([transInfo.client])
			}],
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
		_.forEach(transaction.getTxOuts(), function(txOut){
			if(txOut.lock.isLockedBy([client])){
				unspentValue += txOut.value;
			}
		}.bind(this));
	}.bind(this));
	return unspentValue;
};



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
