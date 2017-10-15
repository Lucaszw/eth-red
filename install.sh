npm install ./broker/
npm install ./webserver/
npm install ./get-node/
npm install ./set-node/

npm link ./get-node/
npm link ./set-node/

cd ~/.node-red
npm link @eth-red/get-node
npm link @eth-red/set-node


