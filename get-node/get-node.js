var _ = require('lodash');
var mqtt = require('mqtt')

module.exports = function(RED) {
    function GetNode(config) {
        config.id = `get-node:${Date.now()}:${Math.random()*100}`;
        const topic = `ethereum/node-updated:${config.id}`;

        console.log("Creating node!", config.id);
        const client  = mqtt.connect('mqtt://localhost:1883');

        RED.nodes.createNode(this,config);
        var node = this;

        client.on('connect', () => {
          console.log("Connected....", config.id);

          // Listen for changes in the contract value:
          client.on('message', (_topic, message) => {
            console.log("received message", _topic);
            if (_topic != topic) return;

            node.send({payload: "UPDATED!!"});
          });

          client.subscribe(topic, undefined, () => {
            console.log("subscribed to : ", topic);
            client.publish("ethereum/register-node", JSON.stringify(config));
          });

        });

        // node.on('input', function(msg) {
        //   node.send({payload: "test"});
        // });

    }
    RED.nodes.registerType("get-node",GetNode);
}
