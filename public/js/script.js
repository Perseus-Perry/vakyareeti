$("a.sic").click(function () {
    $(".search-toggle").animate({
        width: 'toggle'
    });
});

function sharePost(id){
    console.log("ran");
    const shareData = {
    title: 'MDN',
    text: 'Learn web development on MDN!',
    url: 'https://developer.mozilla.org',
  };
  if(navigator.canShare(shareData)){
    navigator.share(shareData);
  }else{
    console.log("unsupported");
  }
}
