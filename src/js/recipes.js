require("./lib/social"); //Do not delete

// function to find minimum
Array.prototype.min = function() {
  return Math.min.apply(null, this);
};

var ingredientsSpring = ["Apricots", "Artichokes", "Asparagus", "Cherries", "Favas", "Peas", "Rhubarb", "Strawberries"];
var ingredientsSummer = ["Blackberries", "Blueberries", "Corn", "Cucumbers", "Eggplant", "Nectarines", "Peaches", "Plums", "Summer Squash", "Tomatoes", "Zucchini"];
var ingredientsFall = ["Apples", "Brussels Sprouts", "Cranberries", "Pears", "Persimmons", "Pomegranates", "Pumpkin", "Winter Squash"];
var ingredientsWinter = ["Beets", "Broccoli", "Cauliflower", "Chard", "Chicories", "Citrus", "Fennel", "Kale", "Mushrooms"];
var ingredientsAll = ingredientsSpring.concat(ingredientsSummer).concat(ingredientsFall).concat(ingredientsWinter);
ingredientsAll = ingredientsAll.sort();

// sticky nav on mobile -------------------------------------------------------

var navHeight;
// if (screen.width <= 480) {
  window.onscroll = function() {activate()};
// }

function activate() {
  var sticker = document.getElementById('stick-me');
  var sticker_ph = document.getElementById('stick-ph');
  var window_top = document.body.scrollTop;
  var div_top = document.getElementById('stick-here').getBoundingClientRect().top + window_top;
  var div_bottom = document.getElementById('stop-here').getBoundingClientRect().top + window_top;

  navHeight = $("#stick-me").height();
  if (window_top > div_top) {
      sticker.classList.add('fixed-nav');
      $("#stick-ph").css("height", navHeight);
      sticker_ph.style.display = 'block'; // puts in a placeholder for where sticky used to be for smooth
  } else {
      sticker.classList.remove('fixed-nav');
      sticker_ph.style.display = 'none'; // removes placeholder
  }
}

var select_season = document.getElementById("select-season");
var select_ingredient = document.getElementById("select-ingredient");
var select_course = document.getElementById("select-course");
var select_diet = document.getElementById("select-diet");

// function to assess all the filters when user picks a new one ---------------------------------------

var count, season_flag = 1, ingredient_flag = 1, courses_flag = 1, diet_flag = 1, flag_min = 1;

// if (screen.width <= 480){
//   var topvar = 140;
// } else {
//   var topvar = 100;
// }

function check_filters() {

  // top position relative to the document
  var pos = $("#top-of-results").offset().top - navHeight;
  $('body, html').animate({scrollTop: pos});

  // $(".how-many-restaurants").css("display","block");

  count = 0;

  $(".recipe-item").filter(function() {

    // check all the classes for the restaurant
    var classes = this.className.toLowerCase().split(" ");

    // check cuisine
    if (select_season.value != "allseasons"){
      season_flag = (classes.indexOf(select_season.value.toLowerCase())>0);
    } else {
      season_flag = 1;
    }

    // check ingredient
    if (select_ingredient.value != "allingredients"){
      ingredient_flag = (classes.indexOf(select_ingredient.value.toLowerCase())>0);
    } else {
      ingredient_flag = 1;
    }

    // check ingredient
    if (select_course.value != "allcourses"){
      courses_flag = (classes.indexOf(select_course.value.toLowerCase())>0);
    } else {
      courses_flag = 1;
    }

    // check ingredient
    if (select_diet.value != "alldiets"){
      diet_flag = (classes.indexOf(select_diet.value.toLowerCase())>0);
    } else {
      diet_flag = 1;
    }

    // see if the restaurant satisfies all conditions set by user
    flag_min = [season_flag, ingredient_flag, courses_flag, diet_flag].min();

    // show it if yes
    if (flag_min == 1){
      $(this).addClass("active");
      count += 1;
    } else {
      $(this).removeClass("active");
    }

  });

  // display text for empty search results
  if (count > 0) {
    document.getElementById('recipe-noresults').classList.add("hide");
  } else {
    document.getElementById('recipe-noresults').classList.remove("hide");
  }

  if (select_season.value == "allseasons" && select_ingredient.value == "allingredients" && select_course.value == "allcourses" && select_diet.value == "alldiets"){
    $("#seeall").addClass("selected");
  } else {
    $("#seeall").removeClass("selected");
  }

}

var fullList = "<option value='allingredients' class='option' selected='selected'>All ingredients</option>";
ingredientsAll.forEach(function(ingred){
  fullList += "<option value='"+ingred.toLowerCase().replace(/ /g,'')+"' class='option'>"+ingred+"</option>";
});

select_season.addEventListener("change",function(event){
  document.getElementById('searchbar').value = "";
  if (select_season.value != "allseasons"){
    // change select options if season is chosen
    var ingredientList = "<option value='allingredients' class='option' selected='selected'>All ingredients</option>";
    if (select_season.value == "spring"){
      ingredientsSpring.forEach(function(ingred){
        ingredientList += "<option value='"+ingred.toLowerCase().replace(/ /g,'')+"' class='option'>"+ingred+"</option>";
      });
    } else if (select_season.value == "summer") {
      ingredientsSummer.forEach(function(ingred){
        ingredientList += "<option value='"+ingred.toLowerCase().replace(/ /g,'')+"' class='option'>"+ingred+"</option>";
      });
    } else if (select_season.value == "fall") {
      ingredientsFall.forEach(function(ingred){
        ingredientList += "<option value='"+ingred.toLowerCase().replace(/ /g,'')+"' class='option'>"+ingred+"</option>";
      });
    } else {
      ingredientsWinter.forEach(function(ingred){
        ingredientList += "<option value='"+ingred.toLowerCase().replace(/ /g,'')+"' class='option'>"+ingred+"</option>";
      });
    }
    document.getElementById("select-ingredient").innerHTML = ingredientList;
    select_ingredient.selectedIndex = 0;
    check_filters();
  } else {
    document.getElementById("select-ingredient").innerHTML = fullList;
    select_ingredient.selectedIndex = 0;
    check_filters();
  }
});

select_ingredient.addEventListener("change",function(event){
  document.getElementById('searchbar').value = "";
  check_filters();
});

select_course.addEventListener("change",function(event){
  document.getElementById('searchbar').value = "";
  check_filters();
});

select_diet.addEventListener("change",function(event){
  document.getElementById('searchbar').value = "";
  check_filters();
});

// searchbar code
$("#searchbar").bind("input propertychange", function () {
  var filter = $(this).val().toLowerCase().replace(/ /g,'');
  var class_match = 0;
  var count = 0;

  select_season.selectedIndex = 0;
  select_ingredient.selectedIndex = 0;
  select_course.selectedIndex = 0;
  select_diet.selectedIndex = 0;

  if (filter == ""){
    $("#seeall").addClass("selected");
  } else {
    $("#seeall").removeClass("selected");
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

check_filters();

document.getElementById("seeall").addEventListener("click", function(e) {
  document.getElementById("select-ingredient").innerHTML = fullList;
  select_ingredient.selectedIndex = 0;
  select_season.selectedIndex = 0;
  select_course.selectedIndex = 0;
  select_diet.selectedIndex = 0;
  document.getElementById('searchbar').value = "";
  check_filters();
  $(this).addClass("selected");
});
