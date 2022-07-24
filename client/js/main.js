const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

//Get username and room from url
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io('http://localhost:80');
// const socket = io();

socket.emit('joinRoom', { username, room });

//get room and users
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

//message from server
socket.on('message', ({ username, text, time }) => {
  console.log({ username, text, time });
  outputMessage(username, text, time);

  //scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

//Message-submit
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();

  ///Get message text
  const msg = e.target.elements.msg.value;

  //Emit message to server
  socket.emit('chatMessage', msg);

  //clear input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

//output msg to dom
function outputMessage(username, text, time) {
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `						<p class="meta">${username} <span>${time}</span></p>
    <p class="text">
        ${text}
    </p>`;
  document.querySelector('.chat-messages').appendChild(div);
}

//add room name to dom
function outputRoomName(room) {
  roomName.innerText = room;
}

//add users to dom
function outputUsers(users) {
  userList.innerHTML = `
        ${users.map((user) => `<li>${user.username}</li>`).join('')}
    `;
}
