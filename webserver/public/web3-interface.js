// Connect to MQTT and listen for transaction requests:
const tryParsingJSON = (str) => {
  let obj;
  try  {
    obj = JSON.parse(str);
  } catch (e) {
    obj = str;
  }
  return obj;
}

class Web3MqttInterface {
  constructor() {
    const clientId = `Web3Mqtt:${Date.now()}:${Math.random()*100}`;
    this.client = new Paho.MQTT.Client("localhost", 8083, clientId);
    this.client.onMessageArrived = this.onMessageArrived.bind(this);
    this.client.onConnectionLost = this.onConnectionLost.bind(this);
    this.client.connect({onSuccess: this.onConnect.bind(this)});

    // Keep track of all getter nodes
    this.nodes = new Map();
  }

  registerNode(payload) {
    this.nodes.set(payload.id, payload);
    if (this.nodes.size == 1) {
      setInterval(this.trackChanges.bind(this), 3000);
    }
    console.log("Registering Node...", payload);
  }

  trackChanges() {
    for (const [id, node] of this.nodes) {
      console.log("checking node", id, node);
      var contractInterface = JSON.parse(node.interface);
      var contract = window.web3.eth.contract(contractInterface);
      var instance = contract.at(node.address);
      instance.get((...args) => {
        console.log("args", args);
        if (args[1] != node.val) {
          console.log("Node has been updated!");
          node.val = args[1];
          this.nodes.set(node.id, node);
          const topic = `ethereum/node-updated:${node.id}`;
          this.client.publish(topic, JSON.stringify(node));
        }
      });
    }
  }

  makeTransaction(payload) {
      var contractInterface = JSON.parse(payload.interface);
      var contract = window.web3.eth.contract(contractInterface);
      var instance = contract.at(payload.address);
      instance.set(`${Date.now()}`, (...args) => {console.log(args)});
  }

  onConnect() {
    console.log("Subscribing...");
    this.client.subscribe("ethereum/make-transaction");
    this.client.subscribe("ethereum/register-node");
  }

  onMessageArrived(msg) {
    console.log("MSG ARRIVED:::");
    console.log(msg);

    const topic = msg.destinationName;

    const payload = tryParsingJSON(msg.payloadString);
    if (topic == "ethereum/make-transaction")
      this.makeTransaction(payload);
    if (topic == "ethereum/register-node")
      this.registerNode(payload);
  }

  onConnectionLost() {
    console.log("Connection lost");
  }
}

new Web3MqttInterface();
