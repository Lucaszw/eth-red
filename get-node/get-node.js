var _ = require('lodash');
var mqtt = require('mqtt')

module.exports = function(RED) {
    function GetNode(config) {
        const id = `get-node:${Date.now()}:${Math.random()*100}`;
        console.log("Creating node!", id);
        const client  = mqtt.connect('mqtt://localhost:8083');
        client.publish("register-node", id);

        RED.nodes.createNode(this,config);
        node = this;
        node.on('input', function(msg) {
          node.send({payload: "test"});
        });

    }
    RED.nodes.registerType("get-node",GetNode);
}
