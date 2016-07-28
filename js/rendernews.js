/*globals
  $, Masonry
*/
// The DOM node where the news gets inserted (appended to)
var newsDOM = document.getElementById("news");

$.getJSON("news/news.json", function (news) {
  // 'news' should be loaded in before this file; assume it's there and
  // formatted correctly.
  for (var i = 0; i < news.length; i++) {
  
    // Container div for each bit of news. This is the element that
    // gets shifted around by masonry.js
    var newsbit = document.createElement("div");
    newsbit.className = "newsbit col-xs-12 col-md-6 col-lg-4";
  
    // Each container div contains a 'card' div, which has some cool styling
    // from bootstrap.
    var card = document.createElement("div");
    card.className = "card";
    newsbit.appendChild(card);
  
    // Optional image tag
    if (news[i].image !== undefined) {
      var card_image = document.createElement("img");
      card_image.className = "card-img-top img-fluid";
      card_image.src = "images/" + news[i].image;
      card_image.alt = "";
      card.appendChild(card_image);
    }
  
    // Each card has a "card-block" inside. This contains some text with
    // margins on left and right side.
    var card_block = document.createElement("div");
    card_block.className = "card-block";
    card.appendChild(card_block);
  
    // If the news has a title, then create a h4 element for it, and append it
    // to the "card block".
    if (news[i].title !== undefined) {
      var header = document.createElement("h4");
      header.className = "card-title";
      header.innerHTML = news[i].title;
      card_block.appendChild(header);
    }
  
    // Every bit of news has some text associated with it. It also goes in
    // the "card block".
    var card_text = document.createElement("div");
    card_text.className = "card-text";
    card_text.innerHTML = news[i].text;
    card_block.appendChild(card_text);
  
    // links
    if (news[i].links !== undefined) {
      var links = document.createElement("div");
      links.className = "card-block";
      var j = 0;
      for (; j < news[i].links.length; j++) {
        var link = document.createElement("a");
        link.href = news[i].links[j].href;
        link.className = "card-link";
        link.innerHTML = news[i].links[j].title;
        links.appendChild(link);
      }
      card.appendChild(links);
    }
  
    // Each bit of news can have an optional footer which is the "tags" of the
    // news. This is not in the "card block" element, but on the "card"
    // element. This is because "card block" has some margins on left and
    // right side, but "footer" needs an upper border which spans the entire
    // card width.
    // TODO: tag is now date. date is now optional. no date means "aktuell".
    if (news[i].date !== undefined) {
      var footer = document.createElement("footer");
      footer.className = "card-footer text-muted";
      footer.innerHTML = news[i].date;
      card.appendChild(footer);
    } else {
      var footer = document.createElement("footer");
      footer.className = "card-footer text-muted";
      footer.innerHTML = "Aktuellt";
      card.appendChild(footer);
    }
  
    // Finally, append the news to the DOM.
    newsDOM.appendChild(newsbit);
  }
  
  // When we are done, engage masonry.js
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
      	  var text = this.querySelector(".card-text").innerHTML;
          return text.match(new RegExp($('#searchstring').val(), "i"));
        }
      });
    });
  /*var msnry = newsDOM.masonry({
    itemSelector: '.newsbit',
    columnWidth: '.card-sizer',
    percentPosition: true,
    transitionDuration: 0
  });*/
});