var app = new Vue({
  el: '#app',
  data: {
    ws: null,
    status: 'Waiting to connect',
    notConnected: true,
    outgoingMessage: '',
    friends: [
      {
        userName: 'beans4dinner2004'
      },
      {
        userName: 'xxXsparklekweenXxx',
      },
      {
        userName: 'yourCrushTeehee',
      },
    ],
    messages: [],
  },
  methods: {
    addMessageToChat: function(name, text) {
      this.messages.push({ name, text });
    },
    connectToWebsocketServer: function() {
      // TODO: put this in env file
      this.ws = new WebSocket("ws://localhost:3000");
      let connectionError = false;
      this.status = 'Connection established';
      this.notConnected = false;

      this.ws.onopen = function() {
        console.log('connection was opened');
      };

      this.ws.onmessage = e => {
        // TODO: update message with dynamic data
        this.addMessageToChat('beans4dinner2004', e.data);
      };

      this.ws.onclose = function() {
        if (!connectionError) {
          this.status = 'Websocket connection closed';
        }
        console.log('Connection closed...');
      };

      this.ws.onerror = function(event) {
        connectionError = true;
        this.status = 'Connection failed due to server error';
        console.log("Connection failed due to error ", event.type);
      };
    },
    sendMessageToFriend: function (friend) {
      // Get and send the message to the websocket server
      // const message = document.getElementById("outgoing-message").value;
      this.ws.send(this.outgoingMessage);
    
      // display message in chat history
      this.addMessageToChat('me', this.outgoingMessage);
    
      // clear textarea
      this.outgoingMessage = '';
    
      // TODO: send blob with friend data to server
      // can only send string, weird array, blob to websocket...
      // const message = {
      //   message: messageToSend,
      //   friend,
      // };
    
      // Should make this a utils function
      // const blob = new Blob([JSON.stringify(message)], {type : 'application/json'});
      // ws.send(blob);
    },
    closeConnection: function () {
      this.ws.close();
      this.notConnected = true;
    }
  }
});
