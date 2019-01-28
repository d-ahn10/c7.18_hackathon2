let map;

var circles = {
	// Volcano: { color: ' #ff0000' },
	// WildFire: { color: '#ff6600' },
	// Fire: { color: ' #ff6600' },
	// HeatWave: { color: ' #ff6600' },
	Drought: { color: '#E78D28' },// orange
	Earthquake: { color: '#8C4309' },// brown
	// LandSlide: { color: '#996633' },
	MudSlide: { color: '#B25D1B' },// light brown
	Epidemic: { color: '#19A309' },// green
	// InsectInfestation: { color: '#5cd65c' },
	// SnowAvalanche: { color: '#afd5ff' },
	// ColdWave: { color: '#99ccff' },
	Flood: { color: '#0FD6CD' },// light blue
	// FlashFlood: { color: '#0059b3' },
	Tsunami: { color: '#1F8FD8' },// blue
	TropicalCyclone: { color: '#1F7BD1' },// another shade of blue
	// StormSurge: { color: '#737373' },
	// SevereLocalStorm: { color: '#737373' },
	// ExtratropicalCyclone: { color: '#737373' },
	// TechnologicalDisaster: { color: ' #000000' },
	// Other: { color: '#000000' },
};

function initMap(makeMapLegend = true) {
	map = new google.maps.Map(document.getElementById('map'), {
	zoom: 1.8,
	mapTypeId: 'roadmap',
	center: {lat: 28.243908, lng: 3.268914},
	mapTypeControl: true,
	// scrollwheel: false,
	mapTypeControlOptions: {
		style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
		position: google.maps.ControlPosition.TOP_RIGHT
	},
	});

	if(makeMapLegend){
		initMapLegend();
	}
}

function initMapLegend() {
	let legend = $('#map_legend');

	for(var key in circles){
		if(key==='Other')
			break;

		let elementDiv = $('<div>', { id: 'elementDiv' });
		let elementCir = $('<div>', { id: 'elementCir', class: 'circle' }).css('background-color', circles[key].color);
		let elementName = $('<span>', { id: 'elementName', text: key, color: circles[key].color });
		elementDiv.append(elementCir, elementName);
		legend.append(elementDiv);
	}
}

var activeInfoWindow;

function placeMarkers(array) {
	for (let i = 0; i < array.length; i++) {
		// debugger;
		const item = array[i];
		if(item.location === undefined){//some location coordinates come back undefined and throws an error
			continue;
		}
		let latLng = new google.maps.LatLng(item.location.lat,item.location.lon);
		let infowindow = new google.maps.InfoWindow({
		  content: 
		  '<div id="markerContent">'+
			  `<h2 id="firstHeading">${item.title}</h2>`+
			  `<h4 id="secondHeading">Disaster Type: ${item.disasterType}</h4>`+
			  '<div id="bodyContent">'+
			  	`<p id="markerContentInfo">${item.body}</p>`+
			  	`<p><a target="_blank" rel="noopener noreferrer" href="${item.url}" class="btn btn-primary" role="button">Read More</a></p>`+
			  '</div>'+
		  '</div>'
		});
		let circle = new google.maps.Circle({
	        strokeColor: circles[item.disasterType],
	        strokeOpacity: 0.8,
	        strokeWeight: 0,
	        fillColor: circles[(item.disasterType).replace(/ /g,'')].color,
	        fillOpacity: 0.6,
	        center: latLng,
	        clickable: true,
	        draggable: false,
	        map: map,
	        radius: (60 * 9500),
	        data: { Title: item.title }
		});
		google.maps.event.addListener(circle, 'click', function(){//ev param
			infowindow.setPosition(circle.getCenter());

			if (activeInfoWindow) {
				activeInfoWindow.close();
			}
			infowindow.open(map);
			activeInfoWindow = infowindow;

			requestNewsData(item.keywords);
      		searchTwitter(item.keywords);
		});
		google.maps.event.addListener(circle, 'mouseover', function(){//ev param
			circle.set('fillOpacity', 0.9);
		});
		google.maps.event.addListener(circle, 'mouseout', function(){//ev param
			circle.set('fillOpacity', 0.6);
		});

		map.addListener('zoom_changed', function(){
			const radius = Math.exp((21-map.zoom)*Math.LN2)
			circle.setRadius(radius)
		});
	}
}
