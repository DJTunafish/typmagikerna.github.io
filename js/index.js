var newsDOM = document.getElementById("news");
var isotp = new Isotope(newsDOM, {
  itemSelector: '.newsbit',
  columnWidth: '.card-sizer',
  percentPosition: true,
  transitionDuration: 0
});

$('#searchstring').on("input", function (e) {
    console.log("hi");
    isotp.arrange({
    	filter: function() {
    	  var text = this.querySelector(".card-text").innerText;
        return text.match(new RegExp($('#searchstring').val(), "i"));
      }
    });
  });