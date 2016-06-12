// 2. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
function onYouTubeIframeAPIReady() {
    $("#play").on("click", function() {

    var player = new YT.Player('player', {
      height: '100',
      width: '100',
      videoId: 'Wc9LSQOoXcU',
      playerVars: {
      controls: 0,
      modestbranding: 0,
      showinfo: 0
      },
      events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange
      }
    });

    $("#play").on("click", function() {
      console.log(player);
      player.playVideo();
      /*$("#pause").css("display", "inline");
          $("#stop").css("display", "inline");
          $("#play").css("display", "none");*/
    });

      $("#stop").on("click", function() {
        console.log(player);
          player.stopVideo();
          /*$("#pause").css("display", "none");
          $("#stop").css("display", "none");
          $("#play").css("display", "inline");*/
    });


    $("#pause").on("click", function() {
      console.log(player);
      player.pauseVideo();
      /*$("#pause").css("display", "none");
      $("#stop").css("display", "inline");
      $("#play").css("display", "inline");*/
    });

  });
};

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
  $("#pause").css("display", "inline");
  $("#stop").css("display", "inline");
  $("#play").css("display", "none");
  event.target.playVideo();
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
function onPlayerStateChange(event) {
  /* YT.PlayerState.ENDED
  YT.PlayerState.PLAYING
  YT.PlayerState.PAUSED
  YT.PlayerState.BUFFERING
  YT.PlayerState.CUED
  */

  if (event.data === YT.PlayerState.PLAYING) {
    $("#pause").css("display", "inline");
    $("#stop").css("display", "inline");
    $("#play").css("display", "none");
  } else if (event.data === YT.PlayerState.ENDED) {
    $("#pause").css("display", "none");
    $("#stop").css("display", "none");
    $("#play").css("display", "inline");
  } else if (event.data === YT.PlayerState.PAUSED) {
    $("#pause").css("display", "none");
    $("#stop").css("display", "inline");
    $("#play").css("display", "inline");
  } else if (event.data === YT.PlayerState.BUFFERING) {
    $("#pause").css("display", "inline");
    $("#stop").css("display", "inline");
    $("#play").css("display", "none");
  } else if (event.data === YT.PlayerState.CUED) {
    $("#pause").css("display", "none");
    $("#stop").css("display", "inline");
    $("#play").css("display", "inline");
  }
}
