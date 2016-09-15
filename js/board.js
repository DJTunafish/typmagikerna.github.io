// Reload this page every 10 minutes.
setTimeout(function() {
    location.reload();
}, 1000 * 60 * 10);

$(document).ready(function () {
    $.simpleWeather({
        location: '57.687747, 11.978457',
        unit: 'c',
        success: function (weather) {
            note = document.createElement("div");
            note.id = "small_note";
            note.innerHTML = "Det är " + weather.temp + " grader " + weather.units.temp + " ute nu.";
            document.body.appendChild(note);
        },
        error: function (error) {
            console.log(error);
        }
    });

    vasttrafik();
});


vasttrafik = function () {
    $.ajax({
        type: "POST",
        url: "https://api.vasttrafik.se/token",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": "Basic WTZpZ05HVmZLQlhEMzd4c2tJQzNXTHp4TnVNYTpHTnVUbnZOZm54MGlQUEdrYmdHMGo5ZXM0R2Nh"
        },
        data: "grant_type=client_credentials&scope=infoskarm",
        success: function (data) {
            console.log(data);
            vasttrafik_board(data.access_token);
        }
    });
};

vasttrafik_board = function (access_token) {
    var d = new Date();
    var time = String(d.getHours()) + "%3A" + String(d.getMinutes());
    var date = String(d.getFullYear()) + "-" + String(d.getMonth()) + "-" + String(d.getDate());
    var stop_id = "9021014001960000"; // vasttrafiks ID of Chalmers stop
    var timespan = "30"; // minutes
    $.ajax({
        type: "GET",
        url: "https://api.vasttrafik.se/bin/rest.exe/v2/departureBoard?id="+stop_id+"&date="+date+"&time="+time+"&timeSpan="+timespan+"&maxDeparturesPerLine=2&format=json",
        success: function (data) {
            console.log(data);
        }
    });
};
