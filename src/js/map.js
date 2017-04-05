require("./lib/social"); //Do not delete
require("leaflet");
var d3 = require('d3');

var bright_green = "#377357";
var dot_green = "#377357";//"red";

(function() {
    var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

    var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

    Date.prototype.getMonthName = function() {
        return months[ this.getMonth() ];
    };
    Date.prototype.getDayName = function() {
        return days[ this.getDay() ];
    };
})();

var now = new Date();

var day = now.getDayName();
var month = now.getMonthName();

console.log("THIS IS TODAY:");
console.log(day);
console.log(month);

// setting parameters for the center of the map and initial zoom level
if (screen.width <= 480) {
  var sf_lat = 37.77;
  var sf_long = -122.43;
  var zoom_deg = 11;
} else {
  var sf_lat = 37.77;
  var sf_long = -122.44;
  var zoom_deg = 13;
}

// tooltip information
function tooltip_function (d) {
  var html_str = "<div class='name bold'>"+d.Name+"<a href="+d.Website+" target='_blank'><i class='fa fa-external-link' aria-hidden='true'></i></a></div><div class='season'>"+d.Season+"</div><div class='hours'>"+d.Hours+"</div><div class='address'>"+d.Address+"</div>"
  return html_str;
}

// put info for highlighted brewery at the top
function fill_info(data){
  var html = "<div class='name bold'>"+data.Name+"<a href="+data.Website+" target='_blank'><i class='fa fa-external-link' aria-hidden='true'></i></a></div><div class='season'>"+data.Season+"</div><div class='hours'>"+data.Hours+"</div><div class='address'>"+data.Address+"</div>";
  return html;
}

// function that zooms and pans the data when the map zooms and pans
function update() {
	feature.attr("transform",
	function(d) {
		return "translate("+
			map.latLngToLayerPoint(d.LatLng).x +","+
			map.latLngToLayerPoint(d.LatLng).y +")";
		}
	)
}


// initialize map with center position and zoom levels
var map = L.map("map", {
  minZoom: 6,
  maxZoom: 15,
  zoomControl: false,
  dragging: true,
  // touchZoom: true
  // zoomControl: isMobile ? false : true,
  // scrollWheelZoom: false
}).setView([sf_lat,sf_long], zoom_deg);;
// window.map = map;

map.dragging.enable();

// add tiles to the map
var mapLayer = L.tileLayer("https://api.mapbox.com/styles/v1/emro/cj0ig2nd700542sqgndpvv99x/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZW1ybyIsImEiOiJjaXl2dXUzMGQwMDdsMzJuM2s1Nmx1M29yIn0._KtME1k8LIhloMyhMvvCDA",{attribution: '© <a href="https://www.mapbox.com/map-feedback/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>'})
mapLayer.addTo(map);

L.control.zoom({
     position:'topright'
}).addTo(map);

// dragging and zooming controls
map.scrollWheelZoom.disable();
// map.dragging.disable();
// map.touchZoom.disable();
// map.doubleClickZoom.disable();
// map.keyboard.disable();

// initializing the svg layer
// L.svg().addTo(map)
map._initPathRoot();

// creating Lat/Lon objects that d3 is expecting
farmData.forEach(function(d,idx) {
    // d.LatLng = new L.LatLng(sf_lat+Math.random(),
    //             sf_long+Math.random());
		d.LatLng = new L.LatLng(d.Lat,
								d.Lng);
});

// creating svg layer for data
var svgMap = d3.select("#map").select("svg"),
g = svgMap.append("g");

// adding circles to the map
var feature = g.selectAll("circle")
  .data(farmData)
  .enter().append("circle")
  .attr("id",function(d) {
    return "market"+d.Name.toLowerCase().replace(/ /g,'').replace(/'/g, '').replace('.','').replace(/\./g,'');
  })
  .attr("class",function(d) {
    return "dot "+"market"+d.Name.toLowerCase().replace(/ /g,'').replace(/'/g, '').replace(/\./g,'');
  })
  .style("opacity", function(d) {
    return 0.9;
  })
  .style("fill", function(d) {
    return "#518D71";
  })
  .style("stroke","#696969")
  .attr("r", function(d) {
    if (screen.width <= 480) {
      return 8;
    } else {
      return 12;
    }
  })
  .on('mouseover', function(d) {
    var html_str = tooltip_function(d);
    tooltip.html(html_str);
    tooltip.style("visibility", "visible");
  })
  .on("mousemove", function() {
    if (screen.width <= 480) {
      return tooltip
        .style("top",70+"px")
        .style("left",40+"px");
        // .style("top",(d3.event.pageY+40)+"px")//(d3.event.pageY+40)+"px")
        // .style("left",10+"px");
    } else if (screen.width <= 1024) {
      console.log("mid");
      return tooltip
        .style("top", (d3.event.pageY+20)+"px")
        .style("left",(d3.event.pageX-50)+"px");
    } else {
      return tooltip
        .style("top", (d3.event.pageY+20)+"px")
        .style("left",(d3.event.pageX-50)+"px");
    }
  })
  .on("mouseout", function(){
      return tooltip.style("visibility", "hidden");
  });

  map.on("viewreset", update);
  update();

// show tooltip
var tooltip = d3.select("div.tooltip-marketmap");


// event listener for each brewery that highlights the brewery on the map and calls the function to fill in the info at the top
var qsa = s => Array.prototype.slice.call(document.querySelectorAll(s));
qsa(".clickme").forEach(function(group,index) {
  group.addEventListener("click", function(e) {
    $('html, body').animate({
        scrollTop: $("#scroll-to-top").offset().top-35
    }, 600);
    document.querySelector("#chosen-market").innerHTML = fill_info(farmData[index]);

    // highlight the appropriate dot
    d3.selectAll(".dot").style("fill", dot_green);
    d3.selectAll(".dot").style("opacity", "0.4");
    d3.selectAll(".dot").style("stroke","black");
    d3.select("#"+e.target.classList[1]).style("fill",dot_green);
    d3.select("#"+e.target.classList[1]).style("opacity","1.0");
    d3.select("#"+e.target.classList[1]).style("stroke","#696969");

    // zoom and pan the map to the appropriate dot
    map.setView(farmData[index].LatLng,map.getZoom(),{animate:true});
    update();
  });
});

// event listener for each dot
qsa(".dot").forEach(function(group,index) {
  group.addEventListener("click", function(e) {
    $('html, body').animate({
        scrollTop: $("#scroll-to-top").offset().top-35
    }, 600);
    document.querySelector("#chosen-market").innerHTML = fill_info(farmData[index]);

    // highlight the appropriate dot
    d3.selectAll(".dot").style("fill", dot_green);
    d3.selectAll(".dot").style("opacity", "0.4");
    d3.selectAll(".dot").style("stroke","black");
    d3.select("#"+e.target.classList[1]).style("fill",dot_green);
    d3.select("#"+e.target.classList[1]).style("opacity","1.0");
    d3.select("#"+e.target.classList[1]).style("stroke","#696969");

    // zoom and pan the map to the appropriate dot
    map.setView(farmData[index].LatLng,map.getZoom(),{animate:true});
    update();
  });
});

// --------------------------------------------------------------
// MAP FUNCTIONALITY  -----------------------------------------
// ----------------------------------------------------------------

// these are all the buttons
// this button clears all filters on the list
var list_click = document.getElementById('list-button');
// this button resets the map
var reset_click = document.getElementById("reset-button");
// this button filters by day
var select_day = document.getElementById("select-day");
// this button filters by current day and current month
var today_button = document.getElementById("opennow-button");

// searchbar code
$("#searchmap").bind("input propertychange", function () {

  var filter = $(this).val().toLowerCase().replace(/ /g,'');
  var class_match = 0;
  var count = 0;

  select_day.selectedIndex = 0;

  if (filter != "") {
    list_click.classList.remove("selected");
    today_button.classList.remove("selected");
  } else {
    list_click.classList.add("selected");
    today_button.classList.remove("selected");
  }

  $(".market-group").filter(function() {

    var classes = this.className.toLowerCase().split(" ");
    for (var i=0; i< classes.length; i++) {

      var current_class = classes[i].toLowerCase();
      if ( current_class.match(filter)) {
        class_match = class_match + 1;
      }
    }
    if (class_match > 0) {
      $(this).addClass("active");
      count += 1;
    } else {
      $(this).removeClass("active");
    }
    class_match = 0;

  });

  // display text for empty search results
  if (count > 0) {
    document.getElementById('map-noresults').classList.add("hide");
  } else {
    document.getElementById('map-noresults').classList.remove("hide");
  }

});

// show markets that match current day and month
today_button.addEventListener("click",function() {
  // set buttons
  list_click.classList.remove("selected");
  today_button.classList.add("selected");
  select_day.selectedIndex = 0;
  document.getElementById('searchmap').value = "";

  var count = 0;

  // check matching days and months
  $(".market-group").filter(function() {
    var filter = day.toLowerCase();
    var classes = this.className.split(" ");
    if ((classes.indexOf(month)>0) && (classes.indexOf(day)>0)) {
      $(this).addClass("active");
      count += 1;
    } else if ((classes.indexOf("Year-round")>0) && (classes.indexOf(day)>0)) {
      $(this).addClass("active");
      count += 1;
    } else {
      $(this).removeClass("active");
    }
  });

  // display text for empty search results
  if (count > 0) {
    document.getElementById('map-noresults').classList.add("hide");
  } else {
    document.getElementById('map-noresults').classList.remove("hide");
  }

})

// show day selected by dropdown
select_day.addEventListener("change",function(){

  // set buttons
  today_button.classList.remove("selected");
  document.getElementById('searchmap').value = "";

  var count = 0;

  // only show markets that match the day / all days
  if (select_day.value != "all") {
    // set button for complete list as false if "all" not chosen
    list_click.classList.remove("selected");
    // show markets that match selected day
    $(".market-group").filter(function() {
      var filter = select_day.value;
      var classes = this.className.toLowerCase().split(" ");
      if (classes.indexOf(filter)>0) {
        $(this).addClass("active");
        count += 1;
      } else {
        $(this).removeClass("active");
      }
    });
  } else {
    // set button for complete list as true if "all" is chosen
    list_click.classList.add("selected");
    // show all markets
    $(".market-group").filter(function() {
      $(this).addClass("active");
      count += 1;
    });
  }

  // display text for empty search results
  if (count > 0) {
    document.getElementById('map-noresults').classList.add("hide");
  } else {
    document.getElementById('map-noresults').classList.remove("hide");
  }

});

// show full list
list_click.addEventListener("click",function(){

  // set buttons
  list_click.classList.add("selected");
  reset_click.classList.remove("selected");
  today_button.classList.remove("selected");
  select_day.selectedIndex = 0;
  document.getElementById('searchmap').value = "";

  // reset map
  document.querySelector("#chosen-market").innerHTML = "";
  d3.selectAll(".dot").style("fill", dot_green);
  d3.selectAll(".dot").style("opacity", "0.8");
  d3.selectAll(".dot").style("stroke","#696969");
  map.setView(new L.LatLng(sf_lat,sf_long),zoom_deg,{animate:true});

  // show all markets
  $(".market-group").filter(function() {
    $(this).addClass("active");
  });

  // do not display text for empty results because all results are shown
  document.getElementById('map-noresults').classList.add("hide");

});

// event listener for re-setting the map
reset_click.addEventListener("click",function(e) {

  //reset map
  document.querySelector("#chosen-market").innerHTML = "";
  d3.selectAll(".dot").style("fill", dot_green);
  d3.selectAll(".dot").style("opacity", "0.8");
  d3.selectAll(".dot").style("stroke","#696969");
  map.setView(new L.LatLng(sf_lat,sf_long),zoom_deg,{animate:true});
});
