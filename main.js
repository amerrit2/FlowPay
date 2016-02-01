

var Network = require('./network.js');
var Logger  = require('./logger.js');
var Transaction = require('./transaction.js');
var Client      = require('./client.js');

Logger.setVerbosity(Logger.DEBUG);

var logger = new Logger('MAIN');


var main = function(){
  
  var client1 = new Client({
      name: "client1",
      startingValue: 100
  });

  var client2 = new Client({
    name: "client2",
    startingValue: 500
  });


  client2.promiseOpenChannelTo(50, client1)
  .then(function(){
    logger.debug("Opened channel. " + client1 + " | " + client2);
  })
  .error(function(error){
    logger.error("Failed to open channel. error=" + error);
  });



  
/*
  var trans = new Transaction({
    inputTrans: null,
    locks: [client1, client2],
    value: 100
  });

  console.log("valid: " + trans.isValid);
  console.log("is locked by false: " + trans.isLockedBy([client1]));
  console.log("is locked by false: " + trans.isLockedBy());
  console.log("is locked by false: " + trans.isLockedBy([client2]));
  console.log("is locked by true: " + trans.isLockedBy([client2, client1]));
  console.log("is locked by true: " + trans.isLockedBy([client1, client2]));
  console.log("is locked by false: " + trans.isLockedBy([client2, client1, {name: "fail"}]));

*/
};

main();
