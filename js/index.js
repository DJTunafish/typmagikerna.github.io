var newsDOM = document.getElementById("news");
var isotp = new Isotope(newsDOM, {
  itemSelector: '.newsbit',
  columnWidth: '.card-sizer',
  percentPosition: true,
  transitionDuration: 0
});

$(newsDOM).imagesLoaded().progress( function() {
    isotp.layout();
});

$('#search').on("input", function (e) {
    isotp.arrange({
    	filter: function() {
    	  var text = this.innerText;
        return text.match(new RegExp($('#search').val(), "i"));
      }
    });
  });

$(function() {
    $('[data-toggle="tooltip"]').tooltip();
});
