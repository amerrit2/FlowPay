


//var Network = require('./network.js');
var Logger      = require('./logger.js');
var Transaction = require('./transaction/transaction.js');
var Client      = require('./client.js');
var Blockchain  = require('./blockchain.js');
var Lock        = require('./transaction/lock.js');

Logger.setVerbosity(Logger.DEBUG);

var logger = new Logger('MAIN');


var main = function(){
  
  
  var client1 = new Client({
      name: "client1"
  });

  var client2 = new Client({
    name: "client2"
  });
  
  var client3 = new Client({
    name: "client3"
  });
  
  var client4 = new Client({
    name: "client4"
  });
  
  var initialTransactions = {
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
  };
  
  Blockchain.initialize(initialTransactions);
  var bc = Blockchain.get();
  
  
  //1=200 2=500 3=0 4=0
  client1.sendValue(client3,100);
  //1=100 2=500 3=100 4=0
 
  client1.sendValue(client4, 50);
  //1=50 2=500 3=100 4=50
  
  client1.sendValue(client2, 25);
  //1=25 2=525 3=100 4=50
  
  client2.sendValue(client3, 100);
  //1=25 2=425 3=200 4=50
  
  client4.sendValue(client2, 25);
  //1=25 2=450 3=200 4=25
  
  client2.sendValue(client3, 450);
  //1=25 2=0   3=650 4=25
  
  client4.sendValue(client3, 25);
  //1=25 2=0 3=675 4=0
  
  client3.sendValue(client1, 675);
  //1=700 2=0 3=0 4=20
  
  client1.sendValue(client3, 543)
  //1=157 2=0 3=543 4=0

  console.log("Client 1 value = " + bc.getClientValue(client1));
  console.log("Client 2 value = " + bc.getClientValue(client2));
  console.log("Client 3 value = " + bc.getClientValue(client3));
  console.log("Client 4 value = " + bc.getClientValue(client4));
  
  
  
  
  
/*
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
