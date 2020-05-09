var socket = io();

function follow(username,currentUser){
  var onclick = "unfollow('"+username+"','"+currentUser+"')";
  socket.emit('follow' , {username:username,currentUser:currentUser});
  document.querySelector(".followBtn").textContent = "Unfollow";
  document.querySelector(".followBtn").setAttribute( "onClick", onclick );
}

function unfollow(username,currentUser){
  var onclick = "follow('"+username+"','"+currentUser+"')";
  socket.emit('unfollow' , {username:username,currentUser:currentUser});
  document.querySelector(".followBtn").textContent = "Follow";
  document.querySelector(".followBtn").setAttribute( "onClick",onclick );
}
