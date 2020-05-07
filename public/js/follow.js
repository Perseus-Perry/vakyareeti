var socket = io();

function follow(username,currentUser){
  socket.emit('follow' , {username:username,currentUser:currentUser});
}

function unfollow(username,currentUser){
  socket.emit('unfollow' , {username:username,currentUser:currentUser});
}
