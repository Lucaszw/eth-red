# @eth-red

Ethereum/Web3 interface for Node-RED. 

## Installation Instructions

The install script will install all necessary components EXCEPT the following:
(please install them manually and globally)

* npm
* node
* node-red

```bash
> sudo bash install.sh
> node .
```

## Getting Started

1. Connect Node-RED nodes to "set-node" & "get-node" accross different node-RED clients:

![UI](/docs/preview.png?raw=true)

2. Enter contract interface and address into the nodes' settings:

![UI](/docs/setter-settings.png?raw=true)

3. Do the same for "get-node":

![UI](/docs/getter-settings.png?raw=true)

## Contributions

Developed By Chris Hajduk & Lucas Zeer as part of EthWaterloo Hackathon (https://ethwaterloo.com/).

Built ontop of:

Node-RED: https://nodered.org/

Ethereum: https://www.ethereum.org/
