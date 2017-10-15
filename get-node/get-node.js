var _ = require('lodash');
var mqtt = require('mqtt')

module.exports = function(RED) {

    function GetNode(config) {
        config.id = `get-node:${Date.now()}:${Math.random()*100}`;
        const topic = `ethereum/node-updated:${config.id}`;
        const client  = mqtt.connect('mqtt://localhost:1883');

        RED.nodes.createNode(this,config);
        var node = this;

        client.on('connect', () => {
          // Listen for changes in the contract value:
          client.on('message', (_topic, message) => {
            if (_topic != topic) return;
            const msg = JSON.parse(message.toString());
            node.send({payload: msg});
          });

          client.subscribe(topic, undefined, () => {
            client.publish("ethereum/register-node", JSON.stringify(config),
              {retain: true});
          });

        });

    }
    RED.nodes.registerType("get-node",GetNode);
}
