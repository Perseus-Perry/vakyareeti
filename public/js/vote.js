  var socket = io();
  var init = Number(document.querySelector(".votes").textContent);

  function upvote(id) {
    if(init == document.querySelector(".votes").textContent ){
        document.querySelector(".votes").textContent = init + 1;
        document.getElementById('votecountbottom').textContent = init + 1;
        socket.emit('upvote', id);
    } else {
        document.querySelector(".votes").textContent = init;
        document.getElementById('votecountbottom').textContent = init;
        socket.emit('downvote', id);
    }


  }

  function downvote(id) {
    if(init == document.querySelector(".votes").textContent ){
        document.querySelector(".votes").textContent = init - 1;
        document.getElementById('votecountbottom').textContent = init - 1;
        socket.emit('downvote', id);
    } else {
        document.querySelector(".votes").textContent = init;
        document.getElementById('votecountbottom').textContent = init;
        socket.emit('upvote', id);
    }

  }
