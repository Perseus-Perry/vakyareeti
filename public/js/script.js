var mode = 1;
function toggleMode() {
  if(mode==1) {
    document.getElementById('mode').href="https://stackpath.bootstrapcdn.com/bootswatch/4.4.1/darkly/bootstrap.min.css";
    document.getElementById('mode').integrity="sha384-rCA2D+D9QXuP2TomtQwd+uP50EHjpafN+wruul0sXZzX/Da7Txn4tB9aLMZV4DZm";
    mode = 0;
  }
  else {
    document.getElementById('mode').href="https://stackpath.bootstrapcdn.com/bootswatch/4.4.1/flatly/bootstrap.min.css";
    document.getElementById('mode').integrity="sha384-yrfSO0DBjS56u5M+SjWTyAHujrkiYVtRYh2dtB3yLQtUz3bodOeialO59u5lUCFF";
    mode = 1;
  }

}

$("a.sic").click(function () {
    $(".search-toggle").animate({
        width: 'toggle'
    });
});
