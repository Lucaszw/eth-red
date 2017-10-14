// Connect to MQTT and listen for transaction requests:
class Web3MqttInterface {
  constructor() {
    const clientId = `Web3Mqtt:${Date.now()}:${Math.random()*100}`;
    this.client = new Paho.MQTT.Client("localhost", 8083, clientId);
    this.client.onMessageArrived = this.onMessageArrived.bind(this);
    this.client.onConnectionLost = this.onConnectionLost.bind(this);
    this.client.connect({onSuccess: this.onConnect.bind(this)});

    // Keep track of all getter nodes
    this.getterNodes = new Array();
  }

  registerNode(payload) {
    console.log("Registering Node...", payload);
  }

  makeTransaction(payload) {
      var contractInterface = JSON.parse(payload.interface);
      var contract = window.web3.eth.contract(contractInterface);
      var instance = contract.at(payload.address);
      instance.set(`${Date.now()}`, (...args) => {console.log(args)});
  }

  onConnect() {
    this.client.subscribe("ethereum/make-transaction");
    this.client.subscrive("ethereum/register-node");
    setTimeout(this.checkForTransaction.bind(this), 1000);
  }

  onMessageArrived(msg) {
    const topic = msg.destinationName;
    const payload = JSON.parse(msg.payloadString);
    if (topic == "ethereum/make-transaction")
      this.makeTransaction(payload);
    if (topic == "ethereum/register-node")
      this.registerNode(payload);

    // Ensure the topic is
    console.log("Message arrived", topic, payload);
  }

  onConnectionLost() {
    console.log("Connection lost");
  }
}

new Web3MqttInterface();
