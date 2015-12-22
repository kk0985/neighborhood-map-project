//the landmarks object contains the information for all of my favorite restaurants that the
//model can make observable and the controller and associated functions can manipulate
var landmarks = [
  {
	name : 'Pho Dai Loi',
	lat : 33.865206,
	lon : -84.305052,
	order :  1,
	cuisine : 'Vietnamese',
	//the status attribute dictates whether the restaurant is visible after sorting
	status : true
  },
  {
	name : 'Taqueria Del Sol',
	lat : 33.787378,
	lon : -84.412928,
	order :  2,
	cuisine : 'Tex Mex',
	status : true
  },
  {
	name : 'TWO Urban Licks',
	lat : 33.768498,
	lon : -84.361257,
	order :  3,
	cuisine : 'Rotisserie',
	status : true
  },
  {
	name : 'King of Pops',
	lat : 33.763779,
	lon : -84.358858,
	order :  4,
	cuisine : 'Popsicles',
	status : true
  },
  {
	name : 'The Greater Good BBQ',
	lat : 33.876289,
	lon : -84.379854,
	order :  5,
	cuisine : 'BBQ',
	status : true
  },
];
//the map variable holds the google map element brought in from google map api
var map;
//the markers array holds all the markers that are presented on the map. this is necessary so that each
//marker can be accessed individually to animate and trigger info window
var markers = [];

//the initMap function is what sets the parameters of the google map object and initializes it
function initMap() {
	try {
		map = new google.maps.Map(document.getElementById('map'), {
		  center: {lat: 33.755, lng: -84.390},
		  zoom: 12,
		  disableDefaultUI: true,
		  maxZoom : 18
		});
	} catch (err) {
		//if google map api does not work
		$('#map').hide();
		$('#map-error').html('<h2 style="text-align: center">Uh oh! The google map request failed</h2>');
	}

	//call to setMarker so that initial map includes all my initial restaurant markers
	setMarkers(map, landmarks);
}

// Sets the map on all markers in the array. I really only use to nullify markers when changing them so i just feed "null" into function
function setMapOnAll(map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

//the setMarkers function creates the markers to go on map and gives them all the information they need applied.
//Information like a wikipedia api call info window, marker image, size, animation, and clickable actions
function setMarkers(map, landmarks) {
	//function to access wikipedia api to return article about restaurant signature dish
	function getWikiDish(restName){
	    // load wikipedia data
	    var dishName;
	    //I use this switch statement to determine wikipedia search parameters per restaurant name
	    switch (restName){
	    	case "Pho Dai Loi":
	    		dishName = "pho";
	    		break;
	    	case "Taqueria Del Sol":
	    		dishName = "taco";
	    		break;
	    	case "TWO Urban Licks":
	    		dishName = "rotisserie";
	    		break;
	    	case "King of Pops":
	    		dishName = "popsicles";
	    		break;
	    	case "The Greater Good BBQ":
	    		dishName = "bbq";
	    		break;
	    	default:
	    		dishName = "food";
	    }

	    var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + dishName + '&format=json&callback=wikiCallback';

	    //the following commented out lines represent the old ajax fallback techniques, i wanted to keep for reference though

	    //timeout variable ensures if wikipedia request times out an error is handled
	    // var wikiRequestTimeout = setTimeout(function(){
	    //     $('wikipedia-container').replaceWith('<p>Apologies the wiki request timed out</p>');
	    // }, 8000);

	    // return $.ajax({
	    //     url: wikiUrl,
	    //     dataType: "jsonp",
	    //     jsonp: "callback",
	    //     async: false,
	    //     success: function( response ) {
	    //         var articleList = response[1];
     //            var articleStr = articleList[0];
     //            var url = 'http://en.wikipedia.org/wiki/' + articleStr;
     //            $('#wikipedia-container').append('<div id="' + dishName + '"><p style="font-weight: bold">' + restName + ' Signature Dish!</p><p style="margin: 5px; text-align: center; font-weight: bold"><a style="color: blue" href="' + url + '">' + articleStr + '</a></p><p style="font-weight: bold">Check it out on Wikipedia :)</p></div>');
	    //         clearTimeout(wikiRequestTimeout);
	    //     }
	    // });
		return $.ajax({
	        url: wikiUrl,
	        dataType: "jsonp",
	        jsonp: "callback",
	        //async: false,
	    }).done(function(data, textStatus, jqXHR) {
            var articleList = data[1];
            var articleStr = articleList[0];
            var url = 'http://en.wikipedia.org/wiki/' + articleStr;
            $('#wikipedia-container').append('<div id="' + dishName + '"><p style="font-weight: bold">' + restName + ' Signature Dish!</p><p style="margin: 5px; text-align: center; font-weight: bold"><a style="color: blue" href="' + url + '">' + articleStr + '</a></p><p style="font-weight: bold">Check it out on Wikipedia :)</p></div>');
	    }).fail(function(){
	    	$('#wikipedia-container').append('<div id="' + dishName + '">Apologies the wiki request timed out</div>');
	    });
	}

	// Adds markers to the map.
	// Marker sizes are expressed as a Size of X,Y where the origin of the image
	// (0,0) is located in the top left of the image.
	// Origins, anchor positions and coordinates of the marker increase in the X
	// direction to the right and in the Y direction down.
	var image = {
	url: 'img/face.png',
	// This marker is 20 pixels wide by 32 pixels high.
	size: new google.maps.Size(25, 35),
	// The origin for this image is (0, 0).
	origin: new google.maps.Point(0, 0),
	// The anchor for this image is the base of the flagpole at (0, 32).
	anchor: new google.maps.Point(0, 35)
	};
	// Shapes define the clickable region of the icon. The type defines an HTML
	// <area> element 'poly' which traces out a polygon as a series of X,Y points.
	// The final coordinate closes the poly by connecting to the first coordinate.
	var shape = {
	coords: [1, 1, 1, 35, 25, 35, 25, 1],
	type: 'poly'
	};

	//initialize my map with no markers
	setMapOnAll(null);
	//remove old markers from array
	markers = [];
	//infowindow object that can be attributed to markers
	infowindow = new google.maps.InfoWindow({
		content : "temp"
	});

	//a timeout to ensure markers to not permanently bounce. has to be outside for loop to work
	function stopAnimation(marker){
		setTimeout(function(){marker.setAnimation(null);}, 1400);
	}

	for (var i = 0; i < landmarks.length; i++) {
		var foodplace = landmarks[i];
		getWikiDish(foodplace.name);
		//console.log(foodplace.name);
		//foodplace.status represents the true/false attribute after a search. so only restaurants that are part of search get a marker
		if (foodplace.status) {
		    var marker = new google.maps.Marker({
		      position: {lat: foodplace.lat, lng: foodplace.lon},
		      map: map,
		      icon: image,
		      shape: shape,
		      title: foodplace.name,
		      animation: google.maps.Animation.DROP,
		      zIndex: foodplace.order
		    });

		    //ensure marker has click attribute for info window
		    google.maps.event.addListener(marker, 'click', function(){
		    	var correctMarkerId;
		    	switch (this.title){
			    	case "Pho Dai Loi":
			    		correctMarkerId = "pho";
			    		break;
			    	case "Taqueria Del Sol":
			    		correctMarkerId = "taco";
			    		break;
			    	case "TWO Urban Licks":
			    		correctMarkerId = "rotisserie";
			    		break;
			    	case "King of Pops":
			    		correctMarkerId = "popsicles";
			    		break;
			    	case "The Greater Good BBQ":
			    		correctMarkerId = "bbq";
			    		break;
			    	default:
			    		correctMarkerId = "food";
			    }
		    	var markertext = $('#'+ correctMarkerId + '').html();
		    	//console.log(this.title);
		    	//console.log($('#wikipedia-container').html());
		    	infowindow.setContent(markertext);
		    	infowindow.open(map, this);
		    });

		    //ensure marker has click attribute for animation
		    marker.addListener('click', function(){
		    	if (this.getAnimation() !== null) {
		    		this.setAnimation(null);
		    	} else {
		    		this.setAnimation(google.maps.Animation.BOUNCE);
		    		stopAnimation(this);
		    	}
		    	//map.setZoom(15);
		    	//map.setCenter(this.getPosition());
		    });
		    //add marker to markers array so that it can be individually accessed for search, etc.
		    markers.push(marker);
		}
	}

	//autocenter map after markers updated
	//new viewpoint bound
	var bounds = new google.maps.LatLngBounds();
	//loop through markers
	$.each(markers, function (index, marker) {
		bounds.extend(marker.position);
	});
	//resize map
	map.fitBounds(bounds);
}

//foodplacemodel is the knockout observable model object that will dynamically drive my sidebar and markers
var foodplaceModel = function(data){
	this.name = ko.observable(data.name);
	this.lat = ko.observable(data.lat);
	this.lon = ko.observable(data.lon);
	this.order = ko.observable(data.order);
	this.cuisine = ko.observable(data.cuisine);
};

//Viewmodel/controller where data gets accessed from DOM and search
var ViewModel = function () {
	//putting this into self where self is viewmodel avoids confusion
	var self = this;

	self.foodList = ko.observableArray([]);
	landmarks.forEach(function(foodplace){
		self.foodList.push(new foodplaceModel(foodplace));
	});

	//the listClick function is how I get from the sidebar dom elements that list restaurants to the markers that represent them
	self.listClick = function(clickedFood) {
		//console.log(typeof(clickedFood.name));
		//console.log(typeof(clickedFood.name()));
		var clickedFoodValue;

		//this was actually a really funny workaround. depending on the searched nature of the sidebar restaurants, the dom element could either
		//represent the foodplacemodel observable object or just the foodplace object. one can be accessed by function and the other can't. so
		//this error catcher addresses both scenarios
		try {
			clickedFoodValue = clickedFood.name();
		}
		catch(err) {
			clickedFoodValue = clickedFood.name;
		}

		//stopping that pesky animation. has to be outside for loop
		function stopAnimation(marker){
			setTimeout(function(){marker.setAnimation(null);}, 1400);
		}

		//console.log(clickedFood.name());
		for (var matchedmarker in markers) {
			//console.log(markers[matchedmarker].title);
			if (markers[matchedmarker].title == clickedFoodValue){
				if (markers[matchedmarker].getAnimation() !== null) {
		    		markers[matchedmarker].setAnimation(null);
		    	} else {
		    		markers[matchedmarker].setAnimation(google.maps.Animation.BOUNCE);
		    		stopAnimation(markers[matchedmarker]);
		    	}
		    	switch (markers[matchedmarker].title){
			    	case "Pho Dai Loi":
			    		correctMarkerId = "pho";
			    		break;
			    	case "Taqueria Del Sol":
			    		correctMarkerId = "taco";
			    		break;
			    	case "TWO Urban Licks":
			    		correctMarkerId = "rotisserie";
			    		break;
			    	case "King of Pops":
			    		correctMarkerId = "popsicles";
			    		break;
			    	case "The Greater Good BBQ":
			    		correctMarkerId = "bbq";
			    		break;
			    	default:
			    		correctMarkerId = "food";
			    }
		    	var markertext = $('#'+ correctMarkerId + '').html();
		    	infowindow.setContent(markertext);
		    	infowindow.open(map, markers[matchedmarker]);
			}
		}
	};

	self.input = ko.observable("");

	//viewmodel search function to take action based on value inside search bar!
	self.search = function(value){
		self.foodList.removeAll();
		for (var place in landmarks){
			landmarks[place].status = false;
		}
		for (place in landmarks){
			if (landmarks[place].name.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
				self.foodList.push(landmarks[place]);
				landmarks[place].status = true;
			}
			else if (landmarks[place].cuisine.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
				self.foodList.push(landmarks[place]);
				landmarks[place].status = true;
			}
		}
		setMarkers(map, landmarks);
	};

	//listener to search bar
	self.input.subscribe(this.search);
};

//apply the knockout observable properties to the ViewModel, essential for dynamic DOM, etc.
ko.applyBindings(new ViewModel);
