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

//share dialogue

function dlgOpn(){
document.querySelector("#overlay").style.visibility = "visible";
};
function dlgClose(){
document.querySelector("#overlay").style.visibility = "hidden";
};

function checkMobile() {
  if (window.screen.width < 500){
    document.getElementById('button-bar').hidden=true;
  }
}
