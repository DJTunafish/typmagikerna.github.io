/*global
  window, $, document
*/

(function () {
}());

window.onscroll = (function () {
    'use strict';

    var isOnTop = true,
        main_nav = $("#main-navigation");
    return function () {
        if (document.body.scrollTop < 50 && isOnTop === false) {
            main_nav.animate({backgroundColor: "rgba(0,0,0,0)"}, 250);
            isOnTop = true;
        } else if (document.body.scrollTop > 50 && isOnTop === true) {
            main_nav.animate({backgroundColor: "#404040"}, 250);
            isOnTop = false;
        }
    };
}());
