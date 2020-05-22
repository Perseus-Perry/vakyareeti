var socket = io();

function generate(){
  socket.emit('generate',{data:""});
}

socket.on('redirect', function(destination) {
    window.location.href = destination;
});
