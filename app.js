window.initMap = function() {
	// Create a styles array to use with the map.
	var styles = [
		{
			featureType: 'water',
			stylers: [
				{ color: '#19a0d8' }
			]
		},{
			featureType: 'administrative',
			elementType: 'labels.text.stroke',
			stylers: [
				{ color: '#ffffff' },
				{ weight: 6 }
			]
		},{
			featureType: 'administrative',
			elementType: 'labels.text.fill',
			stylers: [
				{ color: '#e85113' }
			]
		},{
			featureType: 'road.highway',
			elementType: 'geometry.stroke',
			stylers: [
				{ color: '#efe9e4' },
				{ lightness: -40 }
			]
		},{
			featureType: 'transit.station',
			stylers: [
				{ weight: 9 },
				{ hue: '#e85113' }
			]
		},{
			featureType: 'road.highway',
			elementType: 'labels.icon',
			stylers: [
				{ visibility: 'off' }
			]
		},{
			featureType: 'water',
			elementType: 'labels.text.stroke',
			stylers: [
				{ lightness: 100 }
			]
		},{
			featureType: 'water',
			elementType: 'labels.text.fill',
			stylers: [
				{ lightness: -100 }
			]
		},{
			featureType: 'poi',
			elementType: 'geometry',
			stylers: [
				{ visibility: 'on' },
				{ color: '#f0e4d3' }
			]
		},{
			featureType: 'road.highway',
			elementType: 'geometry.fill',
			stylers: [
				{ color: '#efe9e4' },
				{ lightness: -25 }
			]
		}
	];
	// Constructor creates a new map - only center and zoom are required.
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 40.7413549, lng: -73.9980244},
		zoom: 13,
		styles: styles,
		mapTypeControl: false
	});
	// These are the real estate listings that will be shown to the user.
	// Normally we'd have these in a database instead.
	var largeInfowindow = new google.maps.InfoWindow();
	// Style the markers a bit. This will be our listing marker icon.
	var defaultIcon = makeMarkerIcon('0091ff');
	// Create a "highlighted location" marker color for when the user
	// mouses over the marker.
	var highlightedIcon = makeMarkerIcon('FFFF24');
	// The following group uses the location array to create an array of markers on initialize.
	for (var i = 0; i < window.locations.length; i++) {
		console.log("added marker")
		// Get the position from the location array.
		var position = window.locations[i].location;
		var title = window.locations[i].title;
		// Create a marker per location, and put into markers array.
		var marker = new google.maps.Marker({
			position: position,
			title: title,
			animation: google.maps.Animation.DROP,
			icon: defaultIcon,
			id: i
		});
		// Push the marker to our array of markers.
		markers.push(marker);
		// Create an onclick event to open the large infowindow at each marker.
		marker.addListener('click', function() {
			populateInfoWindow(this, largeInfowindow);
		});
		bounceAnimation(marker)
		// Two event listeners - one for mouseover, one for mouseout,
		// to change the colors back and forth.
		marker.addListener('mouseover', function() {
			this.setIcon(highlightedIcon);
		});
		marker.addListener('mouseout', function() {
			this.setIcon(defaultIcon);
		});
	}
	showListings()
	console.log("completed callback")
}
// This function populates the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and populate based
// on that markers position.
function populateInfoWindow(marker, infowindow) {
	// Check to make sure the infowindow is not already opened on this marker.
	if (infowindow.marker != marker) {
		var wikiURL = 'https://en.wikipedia.org/w/api.php?action=opensearch&search='+marker.title+'&format=json&callback=wikiCallback';
		var wikiRequestTimeout = setTimeout(function() {
			var htmlContent = 'Failed to Retrieve Wikipedia Resources';
			infowindow.marker = marker;
			infowindow.setContent(htmlContent);
			infowindow.open(map, marker);
			// Make sure the marker property is cleared if the infowindow is closed.
			infowindow.addListener('closeclick', function() {
				infowindow.marker = null;
			});
		}, 5000);
		$.ajax({
			url: wikiURL,
			dataType: 'jsonp',
			success: function(response) {
				var htmlContent = '<p>Wikipedia Links</p>';
				var articleList = response[1];
				if (articleList[0]) {
					articleStr = articleList[0];
					var url = 'http://en.wikipedia.org/wiki/'+ articleStr;
					htmlContent += '<p><a target="_blank" href="' + url + '">' + articleStr + '</a></p>';
					htmlContent = '<div>' + marker.title + '</div>' + '<div>' + htmlContent + '</div>';
					infowindow.marker = marker;
					infowindow.setContent(htmlContent);
					infowindow.open(map, marker);
					// Make sure the marker property is cleared if the infowindow is closed.
					infowindow.addListener('closeclick', function() {
						infowindow.marker = null;
					});
				}
				else {
					htmlContent += '<p>No Wikipedia Articles on This Topic</p>';
					infowindow.marker = marker;
					infowindow.setContent(htmlContent);
					infowindow.open(map, marker);
					// Make sure the marker property is cleared if the infowindow is closed.
					infowindow.addListener('closeclick', function() {
						infowindow.marker = null;
					});
				}
				clearTimeout(wikiRequestTimeout);
			}
		});

	}
}
// This function will loop through the markers array and display them all.
function showListings() {
	var bounds = new google.maps.LatLngBounds();
	// Extend the boundaries of the map for each marker and display the marker
	for (var i = 0; i < markers.length; i++) {
		markers[i].setMap(map);
		bounds.extend(markers[i].position);
	}
	map.fitBounds(bounds);
}
// This function will loop through the listings and hide them all.
function hideListings() {
	for (var i = 0; i < markers.length; i++) {
		markers[i].setMap(null);
	}
}
// This function takes in a COLOR, and then creates a new marker
// icon of that color. The icon will be 21 px wide by 34 high, have an origin
// of 0, 0 and be anchored at 10, 34).
function makeMarkerIcon(markerColor) {
	var markerImage = new google.maps.MarkerImage(
		'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
		'|40|_|%E2%80%A2',
		new google.maps.Size(21, 34),
		new google.maps.Point(0, 0),
		new google.maps.Point(10, 34),
		new google.maps.Size(21,34));
	return markerImage;
}
function bounceAnimation(marker) {
	marker.addListener('click', function() {
		marker.setAnimation(google.maps.Animation.BOUNCE);
		setTimeout(function () {
			marker.setAnimation(null);
		}, 700);
	});
}
function render(categoryToFilter, _locations) {
	console.log("render occurs")
	var bounds = new google.maps.LatLngBounds();
	if (categoryToFilter === 'Filter') {
		for (var i = 0; i < _locations.length; i++) {
			markers[i].setMap(map);
			bounds.extend(markers[i].position);
		}
	}
	else {
		for (var i = 0; i < _locations.length; i++) {
			if (_locations[i].category + 's' !== categoryToFilter)
				markers[i].setMap(null);
			else {
				markers[i].setMap(map);
				bounds.extend(markers[i].position);
			}
		}
	}
	map.fitBounds(bounds);
}
$('span a').on('click', function(){
	openSlideMenu();
}) ;
$('div a').on('click', function(){
	closeSlideMenu();
}) ;
function openSlideMenu(){
	document.getElementById('side-menu').style.width = '285px';
	document.getElementById('main').style.marginLeft = '285px';
}

function closeSlideMenu(){
	document.getElementById('side-menu').style.width = '0';
	document.getElementById('main').style.marginLeft = '0';
}
function failMap() {
	alert("Failed to Retrieve Google Maps Resources");
}
var map;
// Create a new blank array for all the listing markers.
var markers = [];


var locations = [
	{title: 'Solomon R. Guggenheim Museum', category: 'Museum', location: {lat: 40.7830, lng: -73.9590}},
	{title: 'Prospect Park', category: 'Park', location: {lat: 40.6602, lng: -73.9690}},
	{title: 'The Cloisters', category: 'Museum', location: {lat: 40.8649, lng: -73.9317}},
	{title: 'Whitney Museum of American Art', category: 'Museum', location: {lat: 40.7829, lng: -73.9654}},
	{title: 'One World Trade Center', category: 'Skyscraper', location: {lat: 40.7127, lng: -74.0134}},
	{title: 'Empire State Building', category: 'Skyscraper', location: {lat: 40.7484, lng: -73.9632393}},
	{title: 'Metropolitan Museum of Art', category: 'Museum', location: {lat: 40.7794, lng: -73.9632}},
	{title: 'High Line', category: 'Park', location: {lat: 40.7480, lng: -74.0048}},
	{title: 'The Battery', category: 'Park', location: {lat: 40.7033, lng: -74.0170}},
	{title: 'Museum of Modern Art', category: 'Museum', location: {lat: 40.7614, lng: -73.9776}},
	{title: 'Chrysler Building', category: 'Skyscraper', location: {lat: 40.7516, lng: -73.9755}},
	{title: 'Central Park', category: 'Park', location: {lat: 40.7396, lng: -74.0089}},
	{title: 'Flatiron Building', category: 'Skyscraper', location: {lat: 40.7411, lng: -73.9897}},
	{title: 'Brooklyn Botanic Garden', category: 'Park', location: {lat: 40.6694, lng: -73.9624}}	
];
var ViewModel = function () {
	var self = this;
	this.firstTime = true;
	this.listOfPoints = ko.observableArray(locations);
	this.filterOptions = [{id: 'filter', name: 'Filter'}, {id: 'parks', name: 'Parks'}, {id: 'skyscrapers', name: 'Skyscrapers'}, {id: 'museums', name: 'Museums'}];
	this.selectedOption = ko.observable();
	this.selectedOption.subscribe(function(obj) {
		console.log('changed');
		if (self.firstTime) {
			self.firstTime = false;
			return;
		}
		self.listOfPoints([]);
		var categoryToFilter = obj.name;
		if (categoryToFilter === 'Filter') {
			self.listOfPoints(locations);
		}
		else {
			for (var i = 0; i < locations.length; i++) {
				if (locations[i].category + 's' !== categoryToFilter) {
					continue;
				}
				self.listOfPoints.push(locations[i]);
			}
		}
		window.render(categoryToFilter, window.locations);
	});
	this.populateInfoWindow_ = function(data) {
		var targetIndex;
		for (var i = 0; i < window.locations.length; i++) {
			if (data === locations[i]){
				targetIndex = i;
				break;
			}
		}
		var targetMarker = window.markers[i];
		google.maps.event.trigger(targetMarker, 'click');
	}
}

ko.applyBindings(new ViewModel());


var x, i, j, selElmnt, a, b, c;
/*look for any elements with the class "custom-select":*/
x = document.getElementsByClassName("custom-select");
for (i = 0; i < x.length; i++) {
	selElmnt = x[i].getElementsByTagName("select")[0];
	/*for each element, create a new DIV that will act as the selected item:*/
	a = document.createElement("DIV");
	a.setAttribute("class", "select-selected");
	a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
	x[i].appendChild(a);
	/*for each element, create a new DIV that will contain the option list:*/
	b = document.createElement("DIV");
	b.setAttribute("class", "select-items select-hide");
	for (j = 0; j < selElmnt.length; j++) {
		/*for each option in the original select element,
		create a new DIV that will act as an option item:*/
		c = document.createElement("DIV");
		c.innerHTML = selElmnt.options[j].innerHTML;
		c.addEventListener("click", function(e) {
				/*when an item is clicked, update the original select box,
				and the selected item:*/
				var y, i, k, s, h;
				s = this.parentNode.parentNode.getElementsByTagName("select")[0];
				h = this.parentNode.previousSibling;
				for (i = 0; i < s.length; i++) {
					if (s.options[i].innerHTML == this.innerHTML) {
						s.selectedIndex = i;
						h.innerHTML = this.innerHTML;
						y = this.parentNode.getElementsByClassName("same-as-selected");
						for (k = 0; k < y.length; k++) {
							y[k].removeAttribute("class");
						}
						this.setAttribute("class", "same-as-selected");
						break;
					}
				}
				h.click();
				$('select').trigger('change');
		});
		b.appendChild(c);
	}
	x[i].appendChild(b);
	a.addEventListener("click", function(e) {
			/*when the select box is clicked, close any other select boxes,
			and open/close the current select box:*/
			e.stopPropagation();
			closeAllSelect(this);
			this.nextSibling.classList.toggle("select-hide");
			this.classList.toggle("select-arrow-active");
		});
}
function closeAllSelect(elmnt) {
	/*a function that will close all select boxes in the document,
	except the current select box:*/
	var x, y, i, arrNo = [];
	x = document.getElementsByClassName("select-items");
	y = document.getElementsByClassName("select-selected");
	for (i = 0; i < y.length; i++) {
		if (elmnt == y[i]) {
			arrNo.push(i)
		} else {
			y[i].classList.remove("select-arrow-active");
		}
	}
	for (i = 0; i < x.length; i++) {
		if (arrNo.indexOf(i)) {
			x[i].classList.add("select-hide");
		}
	}
}
/*if the user clicks anywhere outside the select box,
then close all select boxes:*/
document.addEventListener("click", closeAllSelect);

