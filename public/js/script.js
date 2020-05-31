//mobilemode code
var els ={};
if(screen.width<500){
  document.getElementById('body').classList.add("mob");
  els = document.getElementsByClassName('nonMob-only');
  console.log("mobile")
  }
  else{
    document.getElementById('body').classList.add("notMob");
    els = document.getElementsByClassName('mob-only');
    console.log("not mobile")
  }
  console.log(els);
  for (i = 0; i < els.length; i++) {
    els[i].hidden = true;
  }

//searchbar code
/*var hideState=false;
function searchActive()
{
      document.getElementById('searchbar').hidden=hideState;
      document.getElementById('brandbar').hidden=!hideState;
      document.getElementById('feed-link').hidden=!hideState;
      document.getElementById('explore-link').hidden=!hideState;
      document.getElementById('nav-drop').hidden=!hideState;
      hideState=!hideState;
}*/

//share dialogue
function dlgOpn(){
document.querySelector("#overlay").style.visibility = "visible";
};
function dlgClose(){
document.querySelector("#overlay").style.visibility = "hidden";
};


/*const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');
const currentTheme = localStorage.getItem('theme');

if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);

    if (currentTheme === 'dark') {
        toggleSwitch.checked = true;
    }
}

function switchTheme(e) {
    if (e.target.checked) {
      document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'dark');
    }
    else {
          document.documentElement.setAttribute('data-theme', 'dark');
          localStorage.setItem('theme', 'light');
    }
}

toggleSwitch.addEventListener('change', switchTheme, false);*/
