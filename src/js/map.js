require("./lib/social"); //Do not delete
// require("leaflet");
// var d3 = require('d3');

var bright_green = "#319C6A";//"#377357";
var dot_green = "#178250";//"#377357";//"red";

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

  var top_of_map_scroll = 37;

} else {
  var sf_lat = 37.77;
  var sf_long = -122.44;
  var zoom_deg = 13;

  var top_of_map_scroll = 0;
}

var sidebarinfo = document.getElementById("markets-list");

// tooltip information
function tooltip_function (d) {
  var html_str = "<div class='name bold'>"+d.Name+"<a href="+d.Website+" target='_blank'><i class='fa fa-external-link' aria-hidden='true'></i></a></div><div class='season'>"+d.Season+"</div><div class='hours'>"+d.Hours+"</div><div class='address'>"+d.Address+"</div>"
  return html_str;
}

// put info for highlighted brewery at the top
function fill_info(data){
  var html = "<div class='name bold'>"+data.Name+"<a href="+data.Website+" target='_blank'><i class='fa fa-external-link' aria-hidden='true'></i></a></div><div class='season'>"+data.Season+"</div><div class='hours'>"+data.Hours+"</div><div class='address'><a  class='google-link' href='https://www.google.com/maps/place/"+data.Address+"' target='_blank'>"+data.Address+"<i class='fa fa-map-marker' aria-hidden='true'></i></a></div>";
  return html;
}


// initialize map with center position and zoom levels
var map = L.map("map", {
  minZoom: 6,
  maxZoom: 16,
  zoomControl: false,
  dragging: true,
  // touchZoom: true
  // zoomControl: isMobile ? false : true,
  // scrollWheelZoom: false
}).setView([sf_lat,sf_long], zoom_deg);;
// window.map = map;

map.dragging.enable();

// add tiles to the map
var mapLayer = L.tileLayer("https://api.mapbox.com/styles/v1/emro/cjbib4t5e089k2sm7j3xygp50/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZW1ybyIsImEiOiJjaXl2dXUzMGQwMDdsMzJuM2s1Nmx1M29yIn0._KtME1k8LIhloMyhMvvCDA",{attribution: '© <a href="https://www.mapbox.com/map-feedback/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>'})
mapLayer.addTo(map);

// var gl = L.mapboxGL({
//     accessToken: 'pk.eyJ1IjoiZW1ybyIsImEiOiJjaXl2dXUzMGQwMDdsMzJuM2s1Nmx1M29yIn0._KtME1k8LIhloMyhMvvCDA',
//     style: 'mapbox://styles/emro/cjbib4t5e089k2sm7j3xygp50'
// }).addTo(map);

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
L.svg().addTo(map)
// map._initPathRoot();

// icon for damaged wineries
var greenIcon = new L.Icon({
  iconUrl: '../assets/graphics/marker-icon-green-stroke.png',
  iconSize: [20, 32],
  iconAnchor: [12, 32],
  popupAnchor: [-2, -30],
});

function clickZoom(e) {
    var currentZoom = map.getZoom();
    map.setView(e.target.getLatLng(),currentZoom);
    $('html, body').animate({
        scrollTop: $("#scroll-to-top").offset().top - top_of_map_scroll
    }, 600);
}

// adding markers
var markerArray = {};
var markerNames = [];
farmData.forEach(function(d,idx) {
		d.LatLng = new L.LatLng(d.Lat,
								d.Lng);
    var html_str = tooltip_function(d);
    var marker = L.marker([d.Lat, d.Lng], {icon: greenIcon}).addTo(map).bindPopup(html_str).on('click', clickZoom);
    var markername = d.Name.toLowerCase().replace(/ /g,'').replace(/'/g, '').replace(/\./g,'');
    markername = "market"+markername;
    markerArray[markername] = marker;
    markerNames.push(markername);
});

// event listener for each brewery that highlights the brewery on the map and calls the function to fill in the info at the top
var qsa = s => Array.prototype.slice.call(document.querySelectorAll(s));
qsa(".clickme").forEach(function(group,index) {
  group.addEventListener("click", function(e) {

    var mapclassname = e.target.classList[1];
    map.setView(markerArray[mapclassname].getLatLng(),zoom_deg);
    $('html, body').animate({
        scrollTop: $("#scroll-to-top").offset().top - top_of_map_scroll
    }, 600);
    markerArray[mapclassname].openPopup();

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

  $(".market-group").filter(function(m,mIDX) {

    var classes = this.className.toLowerCase().split(" ");
    for (var i=0; i< classes.length; i++) {

      var current_class = classes[i].toLowerCase();
      if ( current_class.match(filter)) {
        class_match = class_match + 1;
      }
    }
    if (class_match > 0) {
      $(this).addClass("active");
      markerArray["market"+classes[1]]._icon.classList.remove("hide");
      count += 1;
    } else {
      $(this).removeClass("active");
      markerArray["market"+classes[1]]._icon.classList.add("hide");
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

  map.closePopup();
  map.setView(new L.LatLng(sf_lat,sf_long),zoom_deg,{animate:true});

  // check matching days and months
  $(".market-group").filter(function() {
    var filter = day.toLowerCase();
    var classes = this.className.split(" ");
    if ((classes.indexOf(month)>0) && (classes.indexOf(day)>0)) {
      $(this).addClass("active");
      markerArray["market"+classes[1]]._icon.classList.remove("hide");
      count += 1;
    } else if ((classes.indexOf("Year-round")>0) && (classes.indexOf(day)>0)) {
      $(this).addClass("active");
      markerArray["market"+classes[1]]._icon.classList.remove("hide");
      count += 1;
    } else {
      $(this).removeClass("active");
      markerArray["market"+classes[1]]._icon.classList.add("hide");
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
        markerArray["market"+classes[1]]._icon.classList.remove("hide");
        count += 1;
      } else {
        $(this).removeClass("active");
        markerArray["market"+classes[1]]._icon.classList.add("hide");
      }
    });
  } else {
    // set button for complete list as true if "all" is chosen
    list_click.classList.add("selected");
    // show all markets
    $(".market-group").filter(function() {
      $(this).addClass("active");
      markerArray["market"+classes[1]]._icon.classList.remove("hide");
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

  // show all markets
  $(".market-group").filter(function() {
    $(this).addClass("active");
  });

  map.closePopup();
  map.setView(new L.LatLng(sf_lat,sf_long),zoom_deg,{animate:true});

  for (var idx=0; idx<markerNames.length; idx++){
    markerArray[markerNames[idx]]._icon.classList.remove("hide");
  };

  document.getElementById("markets-list").scrollTop = 0;

  // do not display text for empty results because all results are shown
  document.getElementById('map-noresults').classList.add("hide");

});

// event listener for re-setting the map
reset_click.addEventListener("click",function(e) {
  map.setView(new L.LatLng(sf_lat,sf_long),zoom_deg,{animate:true});

  $('html, body').animate({
      scrollTop: $("#scroll-to-top").offset().top - top_of_map_scroll
  }, 600);

  for (var idx=0; idx<markerNames.length; idx++){
    markerArray[markerNames[idx]]._icon.classList.remove("hide");
  };

  // show all markets
  $(".market-group").filter(function() {
    $(this).addClass("active");
  });

  map.closePopup();

  // do not display text for empty results because all results are shown
  document.getElementById('map-noresults').classList.add("hide");

  document.getElementById("markets-list").scrollTop = 0;

});
