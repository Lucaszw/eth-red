const web3 = require('web3');

module.exports = function(RED) {
    function Web3(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        node.on('input', function(msg) {

            msg.payload = config;
            node.send(msg);
        });
    }
    RED.nodes.registerType("web3",Web3);
}
