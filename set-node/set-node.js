var _ = require('lodash');
var mqtt = require('mqtt');
var Web3 = require('web3');
var ethwallet = require('../ethwallet.js');
var solc = require('solc');
var fs = require('fs');

var client  = mqtt.connect('mqtt://localhost:1883');

var contractAddress;

module.exports = function(RED) {
    function SetNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        node.on('input', function(msg) {
            const payload = JSON.stringify(config);
            client.publish("ethereum/make-transaction", payload);
            node.send(msg);
        });

        //Initialize wallet
        var web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/"));//"https://rpc.ethapi.org:8545"));
        web3.eth.accounts.wallet.add(ethwallet.PRIVATE_KEY);
        //Compile Contract
        var source = fs.readFileSync(__dirname + '/contracts/generic.sol','utf8');
        var compiled = solc.compile(source, 1);
        var abi = compiled.contracts[':GenericIndicator'].interface;
        var bytecode = compiled.contracts[':GenericIndicator'].bytecode;
        var gasEstimate = web3.eth.estimateGas({data: bytecode});
        let MyContract = new web3.eth.Contract(JSON.parse(abi));

        var fAddress = web3.eth.accounts.wallet[0].address;
        console.log("Connecting with: " + fAddress);
        //Publish Contract
        let x = MyContract.deploy({data:bytecode});
        let y = x.send({
               from: fAddress,
                gas: 4700000})
            .on('receipt', function(receipt){
                   console.log(receipt.contractAddress);// contains the new contract address
                   contractAddress = receipt.contractAddress;
            });      
        }

    RED.nodes.registerType("set-node",SetNode);
}
