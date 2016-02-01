

var TRACE  = 3,
    DEBUG  = 2,
    ERROR  = 1;

var verbosity = DEBUG;

var Logger = module.exports = function(TAG){
	this.d_tag = TAG;
};
Logger.prototype.getTag = function(){

	return this.d_tag;
};

Logger.prototype.error = function(message){
	if(verbosity >= ERROR){
		console.log("** " + this.d_tag + ": " + message);
	}
};
Logger.prototype.debug = function(message){
	if(verbosity >= DEBUG){
		console.log("** " + this.d_tag + ": " + message);
	}
};
Logger.prototype.trace = function(message){
	if(verbosity >= TRACE){
		console.log("** " + this.d_tag + ": " + message);
	}
};

Logger.setVerbosity = function(v){
	if(v !== TRACE && v !== ERROR && v !== DEBUG){
		throw new Error("Invalid verbosity: " + JSON.stringify(v));
	}

	verbosity = v;
}

Logger.TRACE  = TRACE;
Logger.DEBUG  = DEBUG;
Logger.ERROR  = ERROR;

