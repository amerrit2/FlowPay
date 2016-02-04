

//var Network = require('./network.js');
var Logger      = require('./logger.js');
var Transaction = require('./transaction.js');
var Client      = require('./client.js');
var Blockchain  = require('./blockchain.js');
var Lock        = require('./lock.js');

Logger.setVerbosity(Logger.DEBUG);

var logger = new Logger('MAIN');


var main = function(){
  


  var client1 = new Client({
      name: "client1"
  });

  var client2 = new Client({
    name: "client2"
  });
  
  
  var blockchain = new Blockchain({
    initTransactionInfos: [
      {
        value: 200,
        client: client1
      },
      {
        value: 500,
        client: client2
      }
    ]
  });

  console.log("Client 1 value = " + blockchain.getClientValue(client1));
  console.log("Client 2 value = " + blockchain.getClientValue(client2));

  console.log("Client 1 channeled = " + blockchain.getClientChanneledValue(client1));
  console.log("Client 2 channeled = " + blockchain.getClientChanneledValue(client2));


  /*  

  client2.promiseOpenChannelTo(50, client1)
  .then(function(){
    logger.debug("Opened channel. " + client1 + " | " + client2);
  })
  .error(function(error){
    logger.error("Failed to open channel. error=" + error);
  });

*/

  /*

  var trans = new Transaction({
    tx_ins: null,
    tx_outs: [{
      lock:    new Lock([client1, client2]),
      value:   200,
      isSpent: false,
    }],
    lock_time: null
  });

  console.log("valid: " + trans.isValid());
  console.log("is locked by false: " + trans.isLockedBy(0, [client1]));
  console.log("is locked by false: " + trans.isLockedBy(0, []));
  console.log("is locked by false: " + trans.isLockedBy(0, [client2]));
  console.log("is locked by true: " + trans.isLockedBy(0, [client2, client1]));
  console.log("is locked by true: " + trans.isLockedBy(0, [client1, client2]));
  console.log("is locked by false: " + trans.isLockedBy(0, [client2, client1, {name: "fail"}]));

*/
};

main();
