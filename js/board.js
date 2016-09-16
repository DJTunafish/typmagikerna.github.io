// Reload this page every 10 minutes.
setTimeout(function() {
    location.reload();
}, 1000 * 60 * 10);

$(document).ready(function () {
    weatherApp();
    vasttrafik();
});

function hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

weatherApp = function() {
    var updateNote = function (note, temperature, temp_unit) {
        note.innerHTML = "Det är " + temperature + " grader " + temp_unit + " ute nu.";
        return note;
    };

    var createNote = function (temperature, temp_unit) {
        note = document.createElement("div");
        note.id = "small_note";
        updateNote(note, temperature, temp_unit);
        document.body.appendChild(note);
        return note;
    };

    function updateWeather(note) {
        $.simpleWeather({
            location: '57.687747, 11.978457',
            unit: 'c',
            success: function (weather) {
                updateNote(note, weather.temp, weather.units.temp);
                document.body.appendChild(note);
            },
            error: function (error) {
                console.log(error);
            }
        });
        setTimeout(function(){updateWeather(note);}, 1000 * 60);
    }

    $.simpleWeather({
        location: '57.687747, 11.978457',
        unit: 'c',
        success: function (weather) {
            createNote(weather.temp, weather.units.temp);
            setTimeout(function(){updateWeather(note);}, 1000 * 60);
        },
        error: function (error) {
            console.log(error);
        }
    });
};

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

var convert_vasttrafik_data = function (data) {
    // Don't inherit prototype
    var departure_hash = Object.create(null);

    var now = new Date(data.DepartureBoard.serverdate + " " + data.DepartureBoard.servertime);
    var i = 0;
    for (; i < data.DepartureBoard.Departure.length; i++) {
        var departure = data.DepartureBoard.Departure[i];
        var hash = departure.sname + departure.direction;
        console.log(hash);

        if (departure_hash[hash] === undefined) {
            departure_hash[hash] = Object.create(null);
			departure_hash[hash].name = departure.sname;
			departure_hash[hash].direction = departure.direction;
			departure_hash[hash].color = hexToRgb(departure.fgColor);

			if (departure.rtDate !== undefined && departure.rtTime !== undefined) {
				var diff = (new Date(departure.rtDate + " " + departure.rtTime)) - now;
				departure_hash[hash].minutes = Math.floor(diff / 1000 / 60);
			} else {
				var diff = (new Date(departure.date + " " + departure.time)) - now;
				departure_hash[hash].minutes = Math.floor(diff / 1000 / 60);
			}
        } else {
			// Add next departure time to existing hash object
			if (departure.rtDate !== undefined && departure.rtTime !== undefined) {
				var diff = (new Date(departure.rtDate + " " + departure.rtTime)) - now;
				departure_hash[hash].next = Math.floor(diff / 1000 / 60);
			} else {
				var diff = (new Date(departure.date + " " + departure.time)) - now;
				departure_hash[hash].next = Math.floor(diff / 1000 / 60);
			}
		}
    }

    // convert departure_hash to array (so we can sort it)
    var departures = [];
    var cur = 0;
    for (dep in departure_hash) {
        console.log(dep);
        departures.push(departure_hash[dep]);
        cur += 1;
    }


    var cmp_departures = function (a, b) {
        if (a.minutes > b.minutes) {
            return 1;
        } else if (a.minutes === b.minutes) {
            return 0;
        } else {
            return -1;
        }
    };

    return departures.sort(cmp_departures);
};




var vasttrafik_board = function (access_token) {
    var d = new Date();
    var time = String(d.getHours()) + "%3A" + String(d.getMinutes());
    var date = String(d.getFullYear()) + "-" + String(d.getMonth() + 1) + "-" + String(d.getDate());
    var stop_id = "9021014001960000"; // vasttrafiks ID of Chalmers stop
    var timespan = "30"; // minutes
    $.ajax({
        type: "GET",
        headers: {
            "Authorization": "Bearer " + access_token
        },
        url: "https://api.vasttrafik.se/bin/rest.exe/v2/departureBoard?id="+stop_id+"&date="+date+"&time="+time+"&timeSpan="+timespan+"&maxDeparturesPerLine=2&format=json",
        success: function (data) {
            console.log(data);

            var departures = convert_vasttrafik_data(data);

            console.log(departures);


            // Create table
            table = document.createElement("table");
			table.cellSpacing = 0;
            tr = document.createElement("tr");
            th = document.createElement("th");
            th.colSpan = 4;
            th.classList.add("tram_day_th");

			var d = new Date();
			var day = "";
			if (d.getDay() === 0) {
				day = "Söndag";
			} else if (d.getDay() === 1) {
                day = "Måndag";
            } else if (d.getDay() === 2) {
                day = "Tisdag";
            } else if (d.getDay() === 3) {
                day = "Onsdag";
            } else if (d.getDay() === 4) {
                day = "Torsdag";
            } else if (d.getDay() === 5) {
                day = "Fredag";
            } else if (d.getDay() === 6) {
                day = "Lördag";
            }

            th.innerText = "Fredag";
            tr.appendChild(th);
            table.appendChild(tr);


            // headings
            tr = document.createElement("tr");
            th = document.createElement("th");
            th.innerText = "Linje";
            tr.appendChild(th);
            th = document.createElement("th");
            th.innerText = "Destination";
            tr.appendChild(th);
            th = document.createElement("th");
            th.innerText = "Nästa";
            tr.appendChild(th);
            th = document.createElement("th");
            th.innerText = "Därefter";
            tr.appendChild(th);
            table.appendChild(tr);


            var i = 0;
            for (; i < departures.length; i++) {
                var departure = departures[i];

                tr = document.createElement("tr");
				tr.style.backgroundColor = "rgba(" + departure.color.r + ","+ departure.color.g + "," + departure.color.b + ", 0.5)";
                td = document.createElement("td");
                td.innerText = departure.name;
                tr.appendChild(td);
                td = document.createElement("td");
                td.innerText = departure.direction;
                tr.appendChild(td);
                td = document.createElement("td");
                if (departure.minutes <= 0) {
                    td.innerText = "Nu";
                } else {
                    td.innerText = String(departure.minutes) + " min";
                }
                tr.appendChild(td);

                if (departure.next !== undefined) {
                    td = document.createElement("td");
                    td.innerText = String(departure.next) + " min";
                    tr.appendChild(td);
                    table.appendChild(tr);
                } else {
                    td = document.createElement("td");
                    td.innerText = "";
                    tr.appendChild(td);
                    table.appendChild(tr);
                }
            }

            // add the table to body
            var note = document.createElement("div");
            note.id = "tram_note";
            note.appendChild(table);
            document.body.appendChild(note);
        }
    });
};
