var _ = require('lodash');
var mqtt = require('mqtt');
var Web3 = require('web3');
var ethwallet = require('../ethwallet.js');
var solc = require('solc');
var fs = require('fs');

var client  = mqtt.connect('mqtt://localhost:1883');

var contractAddress;
var ABI;

module.exports = function(RED) {
    function SetNode(config) {
        
        //Initialize wallet
        var web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/"));//"https://rpc.ethapi.org:8545"));
        web3.eth.accounts.wallet.add(ethwallet.PRIVATE_KEY);

        RED.nodes.createNode(this,config);
        var node = this;
        node.on('input', function(msg) {
            config.payload = msg.payload;
            const payload = JSON.stringify(config);
            /*client.publish("ethereum/make-transaction", payload);
            node.send(msg);*/

            var contractInterface = JSON.parse(config.interface);
            var fAddress = web3.eth.accounts.wallet[0].address;
            var contract = new web3.eth.Contract(contractInterface,config.address, {from: fAddress});
            let trans = contract.methods[config.setter](`${config.payload}`);
            let y = trans.send({from: fAddress, gas: 4700000})
                .on('receipt',function(receipt){
                console.log("Block was mined. Block #: " + receipt.blockNumber);
            });
         });

        if (false){
        //Compile Contract
        var source = fs.readFileSync(__dirname + '/contracts/generic.sol','utf8');
        var compiled = solc.compile(source, 1);
        ABI = compiled.contracts[':GenericIndicator'].interface;
        var bytecode = compiled.contracts[':GenericIndicator'].bytecode;
        var gasEstimate = web3.eth.estimateGas({data: bytecode});
        let MyContract = new web3.eth.Contract(JSON.parse(ABI));

        var fAddress = web3.eth.accounts.wallet[0].address;
        console.log("Connecting with: " + fAddress);
        //Publish Contract
        let x = MyContract.deploy({data:bytecode});
        let y = x.send({
                from: fAddress,
                gas: 4700000})
            .on('receipt', function(receipt){
                   console.log("Device Contract Address: " + receipt.contractAddress);// contains the new contract address
                   contractAddress = receipt.contractAddress;
            });      
        }
    }
    RED.nodes.registerType("set-node",SetNode);
}
