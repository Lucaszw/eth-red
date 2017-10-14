var _ = require('lodash');
var mqtt = require('mqtt')


client.subscribe("ethereum/transaction-data");

module.exports = function(RED) {
    function SetBlock(config) {
        RED.nodes.createNode(this,config);
        node = this;
        node.on('input', function(msg) {
        });
    }
    RED.nodes.registerType("get-node",SetBlock);
}
