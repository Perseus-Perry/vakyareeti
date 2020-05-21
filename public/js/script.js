var hideState=false;
function searchActive()
{
      document.getElementById('searchbar').hidden=hideState;
      document.getElementById('brandbar').hidden=!hideState;
      document.getElementById('feed-link').hidden=!hideState;
      document.getElementById('explore-link').hidden=!hideState;
      document.getElementById('nav-drop').hidden=!hideState;
      hideState=!hideState;
}

function share(){
var url= document.location.href;
const canonicalElement = document.querySelector('link[rel=canonical]');
if (canonicalElement !== null){
  url = canonicalElement.href;
}

console.log(navigator.share);
navigator.share({
  url:url
})
}

//share dialogue

function dlgOpn(){
document.querySelector("#overlay").style.visibility = "visible";
};
function dlgClose(){
document.querySelector("#overlay").style.visibility = "hidden";
};
