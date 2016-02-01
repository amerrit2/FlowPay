



var Blockchain = module.exports = function(args){
	//Set up initial genesis transactions
	_.forEach(args.initTransactionInfos, function(transInfo){
		var transaction = new Transaction({
			inputTxids:   null,
			outputs:      {
				value: transInfo.value,
				locks: transInfo.outAddress 
			}
		});
		if(!transaction.isValid()){
			logger.error("Invalid transaction info: " + JSON.stringify(transInfo));
		}else{
			this.d_transactions.push(transaction);
		}
	}.bind(this));
};


Blockchain.prototype.promiseAddTransaction = function(transactionInfo){

	return new Promise(function(accept, reject){
		var inputTransaction;
		_.forEach(this.d_transactions, function(trans){
			if(trans.transaction.getInputTxid() === transaction.getInputTxid()){
				inputTransaction = trans.transaction;
				return false; //exit forEach
			}
		}.bind(this));

		if(!inputTransaction){
			reject(Promise.RejectionError("Failed to find input tx"));
		}else if(inputTransaction.isSpent){
			reject(Promise.RejectionError("Input tx is already spent!"));
		}else{
			inputTransaction.isSpent = true;
		}

		
	}.bind(this)); //outer promise
};