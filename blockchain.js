

var Promise     = require('bluebird');
var Lock        = require('./lock.js');
var _           = require('lodash');
var Transaction = require('./transaction.js');


var Blockchain = module.exports = function(args){

	this.d_transactions = [];

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

Blockchain.prototype.getClientChanneledValue = function(client){
	var channeledValue = 0;
	_.forEach(this.d_channels, function(channel){
		if(channel.hasClient(client)){
			channeledValue += channel.getClientValue(client);
		}
	}.bind(this));

	return channeledValue;

};



Blockchain.prototype.processTransaction = function(transaction){


};
