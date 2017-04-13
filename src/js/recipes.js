require("./lib/social"); //Do not delete

var filter = document.getElementsByClassName('filter');

// sticky nav on mobile -------------------------------------------------------

if (screen.width <= 480) {
  window.onscroll = function() {activate()};
}

function activate() {
  var sticker = document.getElementById('stick-me');
  var sticker_ph = document.getElementById('stick-ph');
  var window_top = document.body.scrollTop;
  var div_top = document.getElementById('stick-here').getBoundingClientRect().top + window_top;
  // var long = document.getElementById('long');

  if (window_top > div_top) {
      sticker.classList.add('fixed-nav');
      $("#stick-ph").css("height", $("#stick-me").height());
      sticker_ph.style.display = 'block'; // puts in a placeholder for where sticky used to be for smooth scrolling
      // long.style.display = 'inline-block';
  } else {
      sticker.classList.remove('fixed-nav');
      sticker_ph.style.display = 'none'; // removes placeholder
      // long.style.display = 'none';
  }
}

// searchbar code
$("#searchbar").bind("input propertychange", function () {
  var filter = $(this).val().toLowerCase().replace(/ /g,'');
  var class_match = 0;
  var count = 0;

  var filter_list = document.getElementsByClassName("filter");
  for (var i=0; i<filter_list.length; i++) {
    filter_list[i].classList.remove("active");
  };
  if (filter == "") {
    document.getElementById("showall").classList.add("active");
  }

  $(".recipe-item").filter(function() {

    var classes = this.className.split(" ");
    for (var i=0; i< classes.length; i++) {

      var current_class = classes[i].toLowerCase();
      if ( current_class.match(filter)) {
        class_match = class_match + 1;
      }
    }
    if (class_match > 0) {
      $(this).addClass("active");
      count+=1;
    } else {
      $(this).removeClass("active");
    }
    class_match = 0;

  });

  // display text for empty search results
  if (count > 0) {
    document.getElementById('recipe-noresults').classList.add("hide");
  } else {
    document.getElementById('recipe-noresults').classList.remove("hide");
  }

});

// clicking for mobile map interactive
var qsa = s => Array.prototype.slice.call(document.querySelectorAll(s));
qsa(".filter").forEach(function(f,index) {
  f.addEventListener("click", function(e) {

    document.getElementById('recipe-noresults').classList.add("hide");

    if (screen.width <= 480) {
      // animated top scrolling
      var pos = $("#stick-here").offset().top-40;
      $('body, html').animate({scrollTop: pos});
    }

    document.getElementById('searchbar').value = "";

    var classes = f.getAttribute("class");
    var classes_ls = classes.split(" ");

    // clicked on a filter level filter
    if (classes.indexOf("subfilter") == -1) {
      // hide all subfilter containers to start - ADD BACK IN LATER!!!
      // var subfilter_list = document.getElementsByClassName("sub-filter-container");
      // for (var i=0; i<subfilter_list.length; i++) {
      //   subfilter_list[i].classList.remove("active");
      // };
      // // check for subfilters that we should display
      // var subfilter_container = document.getElementById("subfilter"+classes_ls[2]);
      // if (subfilter_container) {
      //   subfilter_container.classList.add("active");
      // }

      // add active class to chosen filter (if it is a subfilter, we don't need to hide stuff)
      var filter_list = document.getElementsByClassName("filter");
      for (var i=0; i<filter_list.length; i++) {
        filter_list[i].classList.remove("active");
      };
      f.classList.add("active");

    // clicked on a subfilter level filter
    } else {
      // we just need to add an active class to the subfilter
      var filter_list = document.getElementsByClassName("subfilter");
      for (var i=0; i<filter_list.length; i++) {
        filter_list[i].classList.remove("active");
      };
      f.classList.add("active");
    }

    // show only events that match the chosen filter
    var recipe_list = document.getElementsByClassName("recipe-item");
    // no need to check for filter if the person wanted to show everything
    if (f.id == "showall") {
      // show all events
      for (var j=0; j<recipe_list.length; j++) {
        recipe_list[j].classList.add("active");
      }
    // checking each element for the filter
    } else {
      // show matching events
      for (var j=0; j<recipe_list.length; j++) {
        if (recipe_list[j].classList.toString().indexOf(f.id) >= 0) {
          recipe_list[j].classList.add("active");
        } else {
          recipe_list[j].classList.remove("active");
        }
      }

    }

  });
});
