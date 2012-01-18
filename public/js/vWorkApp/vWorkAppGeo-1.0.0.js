var vWorkTaxico = vWorkTaxico || {};

(function() {

	/**
	Instances GMAP
	*/
	this.generateBaseMap = function(elm){
	
		// todo - refactor me out of this fucking thing - not the responsibility of 'generateBaseMap'
		var lastLat = $.cookie('last_lat');
		var lastLng = $.cookie('last_lng');
		var latlng = new google.maps.LatLng(lastLat,lastLng);
		if (lastLat == null)
			latlng = new google.maps.LatLng('37.752296', '-122.447447');
	
		$(elm).gmap({'center': latlng, 'mapTypeId':  google.maps.MapTypeId.ROADMAP, 'zoom': 8});
		
		$(elm).gmap().bind('init', function(ev, map) {	        
	        google.maps.event.trigger(map, 'resize')
	    });
	}
	
	/**
	Create/Update pickup marker
	*/
	this.updatePickupMarker = function(elm){
	
		var latlng = new google.maps.LatLng(vWorkTaxico.model.pick_up_location_lat(),vWorkTaxico.model.pick_up_location_lng());	
		var marker = $(elm).gmap('get', 'markers > pick_up_location');	

		if (!marker) {		
			$(elm).gmap('addMarker', { 'id': 'pick_up_location', 'position': latlng, 'bounds': false, 'icon':'images/flag-export.png' });
			$(elm).gmap('get', 'map').panTo(latlng);
		} else {
			marker.setPosition(latlng);
		}
	}
	
	/**
	Create/Update driver marker
	*/
	this.updateDriverMarker = function(elm){

		var latlng = new google.maps.LatLng(vWorkTaxico.model.driver_lat(),vWorkTaxico.model.driver_lng());

		if (latlng.lat() == 0)
			return;
		
		var marker = $(elm).gmap('get', 'markers > cab');	
		
		if (!marker) {		
			$(elm).gmap('addMarker', { 'id': 'cab', 'position': latlng, 'bounds': false, 'icon':'images/taxi.png' });
		} else {
			marker.setPosition(latlng);
		}
	}
	
	/**
	Drop marker - not used, for prototype drag/drop
	*/
	this.placeMarker = function(elm, location) {
	  var marker = new google.maps.Marker({
		  position: location, 
		  map: $(elm).gmap('get', 'map'),
		  icon:'spring-hot.png'
	  });
	}
	
		
	/**
	Calculate the distance matrix
	*/
	this.updateDistanceMatrix = function(elm){
		
		var origin_latlng = new google.maps.LatLng(vWorkTaxico.model.driver_lat(),vWorkTaxico.model.driver_lng());
		var destination_latlng = new google.maps.LatLng(vWorkTaxico.model.pick_up_location_lat(),vWorkTaxico.model.pick_up_location_lng());
	
		var request = {
			origins: [origin_latlng],
			destinations: [destination_latlng],
			travelMode: google.maps.TravelMode.DRIVING,
	        unitSystem: google.maps.UnitSystem.METRIC,
    	    avoidHighways: false,
        	avoidTolls: false
		};
		
		$(elm).gmap('displayDistanceMatrix', request, function(result, status){
		
			if (result.rows[0].elements[0].status == "ZERO_RESULTS")
				return;
			
			vWorkTaxico.setModelValue('driver_distance',result.rows[0].elements[0].distance.text);
			vWorkTaxico.setModelValue('driver_eta',result.rows[0].elements[0].duration.text);
		});
	}
	
	/**
	Track map control, write to cookie
	*/
	this.draglistener = {};
	
	this.trackMap = function(elm){
		draglistener = google.maps.event.addListener($(elm).gmap('get', 'map'),'dragend', function(event){
			var latLng = $(elm).gmap('get', 'map').getCenter();
			$.cookie('last_lat',latLng.lat());
			$.cookie('last_lng',latLng.lng());
		});
	}
	this.untrackMap = function(){
		google.maps.event.removeListener(draglistener);
	}
	
	
	/**
	Watches the map for positional changes
	*/
	this.watchMap = function(elm){
		
		$(elm).gmap('watchPosition', function(position, status) {
	
			if ( status === 'OK' ) {
				var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
				var marker = $(elm).gmap('get', 'markers > client' );
				if ( !marker ) {
					$(elm).gmap('addMarker', { 'id': 'client', 'position': latlng, 'icon':'images/male.png' });
				} else {
					marker.setPosition(latlng);
					$(elm).gmap('get', 'map').panTo(latlng);
				}
				$.cookie('last_lat_lng') = latlng;
			}
		});	
		
		vWorkTaxico.trackMap(elm);	
	}
	this.unWatchMap = function(elm){
		$(elm).gmap('clearWatch');
		vWorkTaxico.untrackMap();	
	}
	
	/**
	HTML5 Geolocation
	**/
	this.getMobileLatLng = function(callback){
		
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				function(position){
					var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
					callback(latlng);
				},
				function(error){
					console.log('Cannot find position with this device');	
				},
				{timeout:10000}
			);
		} else {
			error('Not supported');
		}
	}
	
	/**
	Google geocode
	**/
	this.getStreetAddressFromLatLng = function(latlng, successHandler){
		var geocoder = new google.maps.Geocoder();
		if (geocoder) {
			geocoder.geocode({ 'latLng': latlng }, function (results, status) {
				var result = 'Unable to determine location.';
				var region = '';
				if (status == google.maps.GeocoderStatus.OK){
					result = results[0].formatted_address;
					region = results[0].address_components[6].short_name;
				}
				successHandler(result,region);
			});
		}
	}
	
	/**
	Shorthand 'getmenow'
	**/
	this.getCurrentAddress = function(callback){
		this.getMobileLatLng(function(lat_lng_result){
			//var lat_lng_result = new google.maps.LatLng(-35.725188, 174.323456);
 			vWorkTaxico.getStreetAddressFromLatLng(lat_lng_result, function(address_result, region){
				callback({
					address:address_result,
					lat:lat_lng_result.lat(),
					lng:lat_lng_result.lng(),
					region:region
				});	
			});
		});
	}
	
	/**
	Returns an array of addresses matched to partial entry.
	NOTE: Google abhors a partial address.
	*/
	this.partialAddressGeocode = function(address, callback){

		var geocoder = new google.maps.Geocoder();
		var addressList = [];
		var request_payload = { 'address': address };
		if (this.model.user_region_code() != null) request_payload['region'] = this.model.user_region_code();
		if (geocoder) {
			geocoder.geocode(request_payload, function (results, status) {
				addressList = [];		
				if (status == google.maps.GeocoderStatus.OK){
					for (var i = 0; i < 3; i++){
						console.log(results);
						if (results[i])
							addressList.push(results[i]);
					}	
				}
				
				callback(addressList);
			});
		}
	}
	
		
}).apply(vWorkTaxico);