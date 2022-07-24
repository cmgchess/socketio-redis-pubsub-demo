const http = require('http');
const express = require('express');

const { createClient } = require('redis');
const { createAdapter } = require('@socket.io/redis-adapter');
const socketio = require('socket.io');

const formatMessage = require('./utils/messages');
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require('./utils/users');

const PORT = process.env.PORT;

const app = express();
const server = http.createServer(app);

//https://socket.io/docs/v4/using-multiple-nodes/#enabling-sticky-session
const io = socketio(server, {
  cors: {
    origin: ['http://127.0.0.1:5500'],
    methods: ['GET', 'POST'],
    transports: ['websocket', 'polling'],
    credentials: true,
  },
});

const url = 'redis://127.0.0.1:6379';
pubClient = createClient({ url });
subClient = pubClient.duplicate();

//https://socket.io/docs/v4/redis-adapter/#usage
const initPubSub = async () => {
  await Promise.all([pubClient.connect(), subClient.connect()]);
  io.adapter(createAdapter(pubClient, subClient));
};

initPubSub();

const BOT_NAME = 'Chatcord-BOT';

//Run when client connects
io.on('connection', (socket) => {
  console.log(`connected to ${PORT}`);
  socket.on('joinRoom', ({ username, room }) => {
    console.log(`connected to room ${PORT}`);
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    //Welcome current user
    socket.emit(
      'message',
      formatMessage(BOT_NAME, 'Welcome to chatcord!', PORT)
    );

    //broadcase when a user connects
    socket.broadcast
      .to(user.room)
      .emit(
        'message',
        formatMessage(BOT_NAME, `${user.username} has joined the chat`, PORT)
      );

    //send users and room info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  //Listen for chatMessage
  socket.on('chatMessage', (msg) => {
    const user = getCurrentUser(socket.id);
    console.log(`Chat Message: ${msg} from ${user.username} from PORT ${PORT}`);
    io.to(user.room).emit('message', formatMessage(user.username, msg, PORT));
  });

  socket.on('disconnect', () => {
    const user = userLeave(socket.id);
    if (user) {
      io.to(user.room).emit(
        'message',
        formatMessage(BOT_NAME, `${user.username} has left the chat`, PORT)
      );

      //send users and room info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
