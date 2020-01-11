var app = new Vue({
  el: '#app',
  data: {
    ws: null,
    status: 'Waiting to connect',
    notConnected: true,
    outgoingMessage: '',
    currentFriend: 'beans4dinner2004',
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
        this.addMessageToChat(this.currentFriend, e.data);
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
    sendMessageToFriend: function () {
      // Get and send the message to the websocket server
      // this.ws.send(this.outgoingMessage);

      const message = {
        message: this.outgoingMessage,
        friend: this.currentFriend,
      };
      const messageBlob = new Blob([JSON.stringify(message)], {type : 'application/json'});
      this.ws.send(messageBlob);

    
      // display message in chat history
      this.addMessageToChat('me', this.outgoingMessage);
    
      // clear textarea
      this.outgoingMessage = '';
  
    },
    changeCurrentFriend: function (e) {
      this.currentFriend = e.target.innerText;
    },
    closeConnection: function () {
      this.ws.close();
      this.notConnected = true;
    }
  }
});
