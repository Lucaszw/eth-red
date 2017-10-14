var _ = require('lodash');
var mqtt = require('mqtt')

var client  = mqtt.connect('mqtt://localhost:1883');

module.exports = function(RED) {
    function SetNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        node.on('input', function(msg) {
            const payload = JSON.stringify(config);
            client.publish("ethereum/make-transaction", payload);
            node.send(msg);
        });
    }
    RED.nodes.registerType("set-node",SetNode);
}
