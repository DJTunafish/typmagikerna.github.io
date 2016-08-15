var peepsDOM = document.getElementById("peeps");
var isotp = new Isotope(peepsDOM, {
  itemSelector: '.peep',
  columnWidth: '.peep-sizer',
  percentPosition: true,
  transitionDuration: 0
});

$(peepsDOM).imagesLoaded().progress( function() {
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