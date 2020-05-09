function signUpShow() {
  document.getElementById("signup").disabled = true;
  document.getElementById("signin").disabled = false;
  document.getElementById("in-form").hidden = true;
  document.getElementById("up-form").hidden = false;
}

function logInShow() {
  document.getElementById("signup").disabled = false;
  document.getElementById("signin").disabled = true;
  document.getElementById("in-form").hidden = false;
  document.getElementById("up-form").hidden = true;
}

function saveCookie()
{
    var uname = document.getElementById('inputUsername').value;
    var password = document.getElementById('inputPassword').value;
    var tick = document.getElementById('customCheck1').value;
    if(tick){
      document.cookie= "username =" + uname;
      document.cookie= "pp =" + password;
    }
}
function getCookie()
{
    var dat = document.cookie;
    if(!document.cookie === null){
      var uname = dat.substring(dat.indexOf("=")+1,dat.indexOf(";"));
      var pass = dat.substring(dat.lastIndexOf("=")+1);

      document.getElementById('inputUsername').value = uname;
      document.getElementById('inputPassword').value = pass;
    }

}
