  var socket = io();

  function upvote(id) {

    socket.emit('upvote', id);
    document.querySelector(".votes").textContent = Number(document.querySelector(".votes").textContent) + 1;
  }

  function downvote(id) {
    socket.emit('downvote', id);
    document.querySelector(".votes").textContent = Number(document.querySelector(".votes").textContent) - 1;
  }