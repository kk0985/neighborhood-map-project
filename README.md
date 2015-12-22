Kris Klingberg's frontend-nanodegree-neighborhood-map-project
Kris' Favorite Atlanta Landmarks
*********************************
How to "Run"

To run this project simply open the "index.html" file in a browser of your choice.

How to use map

Once you have the app open in your browser, you can left click any marker to see more information about the landmark. The same result can be obtained from left clicking the associate landmark in the list view on the sidebar. The sidebar also contains a search field to search the listed landmarks. The search function removes markers from the map that are not results from the search. Map navigation abilities include zooming in the map with your mouse clickwheel and dragging across with the left click.
*******************************************************************
This project is a single page application featuring a map of my favorite southern city with added javascript functionality for highlighted locations and 3rd party data.

It takes advantage of jQuery and knockout.JS libararies for features that include closures and event listeners, Model View Controller for separation of concerns, declarative bindings, automatic UI refresh, dependency tracking, and AJAX requests.

Google Maps API utilized to display full screen map, marker placement, marker custimization, marker animation, marker infowindows, and map navigation.

Wikipedia API utilized to return top articles based on data keywords.

Application is also dynamic across screen sizes taking advantage of a hidden sidebar triggered by menu button at smaller form factors.



Google API example code

'''javascript var marker = new google.maps.Marker({ position: {lat: landmark.lat, lng: landmark.lon}, map: map, icon: image, shape: shape, title: landmark.name, animation: google.maps.Animation.DROP,}); '''

Wikipedia API example code

'''javascript var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + dishName + '&format=json&callback=wikiCallback'; var wikiRequestTimeout = setTimeout(function(){ $('wikipedia-container').replaceWith('

Apologies the wiki request timed out

'); }, 8000);
return $.ajax({
    url: wikiUrl,
    dataType: "jsonp",
    jsonp: "callback",
    async: false,
    success: function( response ) {
        var articleList = response[1];
        var articleStr = articleList[0];
        var url = 'http://en.wikipedia.org/wiki/' + articleStr;
        $('#wikipedia-container').append('<div id="' + dishName + '"><p style="font-weight: bold">' + restName + ' Signature Dish!</p><p style="margin: 5px; text-align: center; font-weight: bold"><a style="color: blue" href="' + url + '">' + articleStr + '</a></p><p style="font-weight: bold">Check it out on Wikipedia :)</p></div>');

        clearTimeout(wikiRequestTimeout);
    }
});
'''

Directory Structure

The index.html fild contains the application. The css folder holds the stylesheet. The images folder holds the marker picture asset. The javascript (js) folder holds the app logic (app.js) in addition to the jQuery and Knockout libraries.

Contributing

Anyone is welcome to re-use the code used in this project.

References

Udacity JavaScript Design Patters Class
Udacity Intro to AJAX Class
Google Maps API Documentation
Knockout JS Documentation
JQueury Documentation
Contact Me

For any questions please email me at kris.klingberg@gmail.com

License

The content of this repository is not licensed.