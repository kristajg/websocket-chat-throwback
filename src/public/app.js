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
    allChats: [],
  },
  methods: {
    addMessageToChat: function(name, text) {
      let chatHistory = this.allChats.find(chat => chat.userName === name);
      const myChat = {
        name: 'me',
        text: this.outgoingMessage,
        timeStamp: new Date(),
      };
      const theirChat = {
        name,
        text,
        timeStamp: new Date(),
      };

      if (chatHistory !== undefined) {
        // Add to the chat history for this friend
        chatHistory.messages.push(myChat);
        chatHistory.messages.push(theirChat);
        let chatIndex = this.allChats.findIndex(chat => chat.userName === name);
        this.allChats[chatIndex] = chatHistory
      } else {
        // No chat history exists for this friend, create one
        this.allChats.push({
          userName: name,
          messages: [
            myChat,
            theirChat,
          ],
        });
      }

      // clear textarea
      this.outgoingMessage = '';
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
      const message = {
        message: this.outgoingMessage,
        friend: this.currentFriend,
      };
      const messageBlob = new Blob([JSON.stringify(message)], {type : 'application/json'});
      this.ws.send(messageBlob);  
    },
    changeCurrentFriend: function (e) {
      this.currentFriend = e.target.innerText;
    },
    closeConnection: function () {
      this.ws.close();
      this.notConnected = true;
    }
  },
  computed: {
    getChatMessageHistory: function () {
      let chatHistory = this.allChats.find(chat => chat.userName === this.currentFriend);
      return chatHistory !== undefined ? chatHistory.messages : [];
    },
  },
});
