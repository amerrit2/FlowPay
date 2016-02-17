

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
    var msg = ("** " + this.d_tag + ": " + message + "\n**||||");
    var i = 1;
    while(i < (arguments.length)){
      msg += "\n**\t" + JSON.stringify(arguments[i]); 
      ++i;
    }
    msg += "\n**||||";
    console.log(msg);
  }
};
Logger.prototype.debug = function(message){
  if(verbosity >= DEBUG){
    var msg = ("** " + this.d_tag + ": " + message + "\n**||||");
    var i = 1;
    while(i < (arguments.length)){
      msg += "**\n\t" + JSON.stringify(arguments[i]); 
      ++i;
    }
    msg += "\n**||||";
    console.log(msg);
  }
};
Logger.prototype.trace = function(message){
  if(verbosity >= TRACE){
    var msg = ("** " + this.d_tag + ": " + message + "\n**||||");
    var i = 1;
    while(i < (arguments.length)){
      msg += "**\n\t" + JSON.stringify(arguments[i]); 
      ++i;
    }
    msg += "\n**||||";
    console.log(msg);
  }
};

function printToConsole(message){

  
};

Logger.setVerbosity = function(v){
  if(v !== TRACE && v !== ERROR && v !== DEBUG){
    throw new Error("Invalid verbosity: " + JSON.stringify(v));
  }

  verbosity = v;
};

Logger.TRACE  = TRACE;
Logger.DEBUG  = DEBUG;
Logger.ERROR  = ERROR;

