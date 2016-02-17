

var Assert = require('assert-plus');
var _      = require('lodash');

var Lock = module.exports = function Lock(args){
  
  Assert.array(args.clients, 'args.clients');
  
  if(_.uniq(args.clients).length !== args.clients.length){
    throw new Error("args.clients must not contain duplicates!");
  }
  
  this.d_clients = args.clients;
  
};

Lock.prototype.getNumClients = function(){
  return this.d_clients.length;
};

Lock.prototype.hasClient = function(client){
  return(_.indexOf(this.d_clients, client) > -1);
};


