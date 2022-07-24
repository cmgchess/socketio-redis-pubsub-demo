const users = [];

//join users to chat

function userJoin(id, username, room) {
  const user = { id, username, room };
  users.push(user);
  return user;
}

// get current user

function getCurrentUser(id) {
  return users.find((user) => id === user.id);
}

// user leaves chat
function userLeave(id){
    const index = users.findIndex((user) => user.id === id);

    if(index !== -1){
        return users.splice(index,1)[0];
    }
}

//get room users
function getRoomUsers(room){
    return users.filter((user) => user.room === room);
}


module.exports = {
  getCurrentUser,
  userJoin,
  userLeave,
  getRoomUsers
};
