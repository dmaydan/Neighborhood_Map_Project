


var map;
// Create a new blank array for all the listing markers.
var markers = [];
function initMap() {
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
	var locations = [
		{title: 'Park Ave Penthouse', location: {lat: 40.7713024, lng: -73.9632393}},
		{title: 'Chelsea Loft', location: {lat: 40.7444883, lng: -73.9949465}},
		{title: 'Union Square Open Floor Plan', location: {lat: 40.7347062, lng: -73.9895759}},
		{title: 'East Village Hip Studio', location: {lat: 40.7281777, lng: -73.984377}},
		{title: 'TriBeCa Artsy Bachelor Pad', location: {lat: 40.7195264, lng: -74.0089934}},
		{title: 'Chinatown Homey Space', location: {lat: 40.7180628, lng: -73.9961237}}
	];
	var largeInfowindow = new google.maps.InfoWindow();
	// Style the markers a bit. This will be our listing marker icon.
	var defaultIcon = makeMarkerIcon('0091ff');
	// Create a "highlighted location" marker color for when the user
	// mouses over the marker.
	var highlightedIcon = makeMarkerIcon('FFFF24');
	var largeInfowindow = new google.maps.InfoWindow();
	// The following group uses the location array to create an array of markers on initialize.
	for (var i = 0; i < locations.length; i++) {
		// Get the position from the location array.
		var position = locations[i].location;
		var title = locations[i].title;
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
	showListings();
}
// This function populates the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and populate based
// on that markers position.
function populateInfoWindow(marker, infowindow) {
	// Check to make sure the infowindow is not already opened on this marker.
	if (infowindow.marker != marker) {
		infowindow.marker = marker;
		infowindow.setContent('<div>' + marker.title + '</div>');
		infowindow.open(map, marker);
		// Make sure the marker property is cleared if the infowindow is closed.
		infowindow.addListener('closeclick', function() {
			infowindow.marker = null;
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




var locations = [
	{title: 'Solomon R. Guggenheim Museum', category: 'Museum', location: {lat: 40.7830, lng: 73.9590}},
	{title: 'Prospect Park', category: 'Park', location: {lat: 40.6602, lng: 73.9690}},
	{title: 'The Cloisters', category: 'Museum', location: {lat: 40.8649, lng: 73.9317}},
	{title: 'Whitney Museum of American Art', category: 'Museum', location: {lat: 40.7829, lng: 73.9654}},
	{title: 'One World Trade Center', category: 'Skyscraper', location: {lat: 40.7127, lng: 74.0134}},
	{title: 'Empire State Building', category: 'Skyscraper', location: {lat: 40.7484, lng: -73.9632393}},
	{title: 'Metropolitan Museum of Art', category: 'Museum', location: {lat: 40.7794, lng: 73.9632}},
	{title: 'High Line', category: 'Park', location: {lat: 40.7480, lng: 74.0048}},
	{title: 'The Battery', category: 'Park', location: {lat: 40.7033, lng: 74.0170}},
	{title: 'Museum of Modern Art', category: 'Museum', location: {lat: 40.7614, lng: 73.9776}},
	{title: 'Chrysler Building', category: 'Skyscraper', location: {lat: 40.7516, lng: 73.9755}},
	{title: 'Central Park', category: 'Park', location: {lat: 40.7396, lng: 74.0089}},
	{title: 'Flatiron Building', category: 'Skyscraper', location: {lat: 40.7411, lng: 73.9897}},
	{title: 'Brooklyn Botanic Garden', category: 'Park', location: {lat: 40.6694, lng: 73.9624}}	
];
var ViewModel = function () {
	var self = this;
	this.listOfPoints = ko.observableArray(locations);
	this.filterOptions = [{id: 'all', name: 'All'}, {id: 'parks', name: 'Parks'}, {id: 'skyscrapers', name: 'Skyscrapers'}, {id: 'museums', name: 'Museums'}];
	this.selectedOption = ko.observable();
	this.selectedOption.subscribe(function(obj) {
		console.log('It changed!');
		self.listOfPoints([]);
		var categoryToFilter = obj.name;
		if (categoryToFilter === 'All') {
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
	});
}

ko.applyBindings(new ViewModel());
var delayInMilliseconds = 3000; //1 second

setTimeout(function() {
  //your code to be executed after 1 second
}, delayInMilliseconds);
hideListings();
var delayInMilliseconds = 3000; //1 second

setTimeout(function() {
  //your code to be executed after 1 second
}, delayInMilliseconds);
showListings();