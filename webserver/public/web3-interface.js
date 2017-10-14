// Connect to MQTT and listen for transaction requests:
class Web3MqttInterface {
  constructor() {
    const clientId = `Web3Mqtt:${Date.now()}:${Math.random()*100}`;
    this.client = new Paho.MQTT.Client("localhost", 8083, clientId);
    this.client.onMessageArrived = this.onMessageArrived.bind(this);
    this.client.onConnectionLost = this.onConnectionLost.bind(this);
    this.client.connect({onSuccess: this.onConnect.bind(this)});
  }

  readTransaction(payload) {
    console.log("Reading transaction...");
    // var contractInterface = JSON.parse(payload.interface);
    // var contract = window.web3.eth.contract(contractInterface);
    // var instance = contract.at(payload.address);
    // instance.get((...args) => {console.log(args)});
  }

  makeTransaction(payload) {
      var contractInterface = JSON.parse(payload.interface);
      var contract = window.web3.eth.contract(contractInterface);
      var instance = contract.at(payload.address);
      instance.set(`${Date.now()}`, (...args) => {console.log(args)});
  }

  onConnect() {
    this.client.subscribe("ethereum/make-transaction");
    this.client.subscribe("ethereum/read-transaction");
    console.log("Connected...");
  }

  onMessageArrived(msg) {
    const topic = msg.destinationName;
    const payload = JSON.parse(msg.payloadString);
    if (topic == "ethereum/make-transaction")
      this.makeTransaction(payload);
    if (topic == "ethereum/read-transaction")
      this.readTransaction(payload);
    // Ensure the topic is
    console.log("Message arrived", topic, payload);
  }

  onConnectionLost() {
    console.log("Connection lost");
  }
}

new Web3MqttInterface();
