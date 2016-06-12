window.onscroll = (function() {
  var isOnTop = true,
    main_nav = $("#main-nav");
  return function() {
    if (document.body.scrollTop < 50 && isOnTop === false) {
      main_nav.animate({backgroundColor: "rgba(0,0,0,0)"}, 250);
      isOnTop = true;
    } else if (document.body.scrollTop > 50 && isOnTop === true) {
      main_nav.animate({backgroundColor: "black"}, 250);
      isOnTop = false;
    }
  };
}());
