let ws = null;

// Websocket functions
function addMessageToChat(name, message) {
  let messageToDisplay = document.createElement('div');
  messageToDisplay.textContent = `${name}: ${message}`;
  document.getElementById('messages').append(messageToDisplay);
}

function connectToWebsocketServer() {
  // Websocket object created
  // TODO: put this in env file
  ws = new WebSocket("ws://localhost:3000");
  let connectionError = false;

  // Style appropriately for successful connection
  document.getElementById("status").innerHTML = 'Connection established';
  setTimeout(function(){
    document.getElementById("connection-init").style.display = "none";
    document.getElementById("chat-container").style.display = "block";
  }, 750);

  ws.onopen = function() {
    console.log('connection was opened');
    // if anything needs done on connection open, do so here
  };

  ws.onmessage = function (e) {
    // TODO: update message with dynamic data
    addMessageToChat('beans4dinner2004', e.data);
  };

  ws.onclose = function() {
    if (!connectionError) {
      document.getElementById("status").innerHTML = 'Websocket connection closed';
    }
    console.log('Connection closed...');
  };

  ws.onerror = function(event) {
    connectionError = true;
    document.getElementById("status").innerHTML = 'Connection failed due to server error';
    console.log("Connection failed due to error ", event.type);
  };
};

function sendMessageToFriend(friend) {
  // Get and send the message to the websocket server
  const message = document.getElementById("outgoing-message").value;
  ws.send(message);

  // display message in chat history
  addMessageToChat('me', message);

  // clear textarea
  document.getElementById("outgoing-message").value = "";

  // TODO: send blob with friend data to server
  // can only send string, weird array, blob to websocket...
  // const message = {
  //   message: messageToSend,
  //   friend,
  // };

  // Should make this a utils function
  // const blob = new Blob([JSON.stringify(message)], {type : 'application/json'});
  // ws.send(blob);
}

function closeConnection() {
  ws.close();
  document.getElementById("connection-init").style.display = "block";
  document.getElementById("chat-container").style.display = "none";
}
