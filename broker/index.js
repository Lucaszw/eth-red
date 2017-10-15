const path = require("path");
const mosca = require("mosca");

class EthMqttBrocker  {
  /* Simple broker Node-RED */
  constructor() {
    const http  = new Object();
    http.port   = 8083;
    http.bundle = true;
    http.static = path.resolve(".");

    const settings = new Object();
    settings.port  = 1883;
    settings.http  = http;

    const db_settings         = new Object();
    db_settings.path          = path.join(__dirname, "db");
    db_settings.subscriptions = 0;
    db_settings.packets       = 0;

    this.db = new mosca.persistence.LevelUp(db_settings);
    this.settings = settings;
    this.server = new mosca.Server(settings);
    this.db.wire(this.server);

    this.server.on('clientConnected', this.onClientConnected.bind(this));
    this.server.on('published', this.onPublished.bind(this));
    this.server.on('ready', this.onReady.bind(this));
  }

  onClientConnected(client) {
    console.log('client connected', client.id);
    const message = new Object();
    message.topic = "ethereum/ready";
    message.payload = "Hello from the broker";
    message.qos = 0;
    message.retain = true;
    setTimeout(()=>{this.server.publish(message)}, 1000);

  }

  onPublished(packet, client) {
    console.log('Published', packet.payload);
  }

  onReady() {
    console.log('Mosca server is up and running');
  }

}

if (require.main === module) {
  const brocker = new EthMqttBrocker();
}
