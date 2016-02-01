

var _ = require('lodash');


var Network = function(){


};

Network.prototype.promiseCreateChannel = function(args){

    var channel = new Channel({
		openChannelTransaction: args.openChannelTransaction;
	    upstreamClientId:               args.this;
	    downstreamClientId:       args.downstreamClient;
    });

};



module.exports = new Network();

