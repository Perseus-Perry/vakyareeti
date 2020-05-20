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

function sharePost(){
var url= document.location.href;
cons canonicalElement = document.querySelector('link[rel=canonical]');
if (canonicalElement !== null){
  url = canonicalElement.href;
}
navigator.share({
  url:url;
})
}
