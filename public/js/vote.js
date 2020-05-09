  var socket = io();
  var init = Number(document.querySelector(".votes").textContent);

  function upvote(id) {
    if(init == document.querySelector(".votes").textContent ){
        document.querySelector(".votes").textContent = init + 1;
    } else {
        document.querySelector(".votes").textContent = init;
    }

    socket.emit('upvote', id);
  }

  function downvote(id) {
    if(init == document.querySelector(".votes").textContent ){
        document.querySelector(".votes").textContent = init - 1;
    } else {
        document.querySelector(".votes").textContent = init;
    }

    socket.emit('downvote', id);
  }
