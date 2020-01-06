// External libraries
const WebSocket = require('ws');
const express = require('express');
const cors = require('cors');
const open = require('open');
const path = require('path');

// JSON data in lieu of db
const chatData = require('./src/data/chatData.json');

// Server constants
// TODO: put this in env file
const wsPort = 3000;
const appPort = 3001;

///////////////////////
//                   //
// WEBSOCKET SERVER  //
//                   //
///////////////////////
const wss = new WebSocket.Server({ port: wsPort });
console.log(`Websocket server listening on port ${wsPort}`)

wss.on('connection', function connection(ws) {
  console.log('ws server connected');

  ws.on('message', function incoming(message) {
    console.log('received: %s', message);

    // TODO: get message for friend passed in message dynamically
    let temporaryMessages = chatData.friends.beans4dinner2004.messages;
    // TODO: Custom code for chat...getting a blob & parsing out data
    // console.log('ws data... ', ws.data);
    // let parsedMessage = JSON.parse(message);
    // console.log('parsed json is ', parsedMessage);

    // TODO: integrate some natural language processes here to have a more appropriate response
    let randomizedIndex = Math.floor(Math.random() * temporaryMessages.length) + 0
    ws.send(temporaryMessages[randomizedIndex]);
  });
});


///////////////////////
//                   //
// EXPRESS SERVER    //
//                   //
///////////////////////
const app = express();

app.use(cors())
app.use("/public", express.static(__dirname + "/src/public"));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/index.html'));
});

app.listen(appPort, () => {
  console.log(`HTML app server listening on port ${appPort}`);
  open(`http://localhost:${appPort}`);
});
