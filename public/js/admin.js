var socket = io();

function generate(){
  socket.emit('generate',{data:""});
}
