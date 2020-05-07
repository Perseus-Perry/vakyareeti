  var socket = io();
  var init = Number(document.querySelector(".votes").textContent);

  function upvote(id) {
    document.getElementById('upvote').disabled=true;
    if(document.getElementById('downvote'.disabled==true)){
      document.getElementById('downvote').disabled=false;
    }

    socket.emit('upvote', id);
    document.querySelector(".votes").textContent = init + 1;
  }

  function downvote(id) {
    document.getElementById('downvote').disabled=true;
    if(document.getElementById('upvote'.disabled==true)){
      document.getElementById('upvote').disabled=false;
    }

    socket.emit('downvote', id);
    document.querySelector(".votes").textContent = init - 1;
  }
