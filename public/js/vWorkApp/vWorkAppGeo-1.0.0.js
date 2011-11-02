var vWorkTaxico = vWorkTaxico || {};

(function() {

	/**
	Instances GMAP
	Requires: jquery.cookie.js
	*/
	this.generateBaseMap = function(elm){
	
		var latlng = $.cookie('last_lat_lng');
		if (latlng == null)
			var latlng = new google.maps.LatLng('37.752296', '-122.447447');
	
		$(elm).gmap({'center': latlng, 'mapTypeId':  google.maps.MapTypeId.ROADMAP, 'zoom': 8});
		
		$(elm).gmap().bind('init', function(ev, map) {	        
	        google.maps.event.trigger(map, 'resize')
	    });
	}
	
	/**
	Generate base marker for pickup
	*/
	this.createPickupMarker = function(elm){
	
		var latlng = $(document).data('pick_up_location');
		
		var marker = $(elm).gmap('get', 'markers > client');	
		console.log(latlng);
		if (!marker) {		
			$(elm).gmap('addMarker', { 'id': 'client', 'position': latlng, 'bounds': true });
		} else {
			marker.setPosition(latlng);
			map.panTo(latlng);
		}
	}
	
	/**
	Track map control, write to cookie
	*/
	
	var draglistener;
	
	this.trackMap = function(elm){
		draglistener = google.maps.event.addListener($(elm),dragend, function(event){
			console.log('drag ended biatch');
		});
	}
	this.untrackMap = function(elm){
		google.maps.event.removeListener(draglistener);
	}
	
	
	/**
	Watches the map for positional changes
	*/
	this.watchMap = function(elm){
	
		console.log('watching map');
	
		$(elm).gmap('watchPosition', function(position, status) {
			console.log('Watch position has status '+status);
			if ( status === 'OK' ) {
				var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
				var marker = $(elm).gmap('get', 'markers > client' );
				if ( !marker ) {
					$(elm).gmap('addMarker', { 'id': 'client', 'position': latlng, 'bounds': true });
				} else {
					marker.setPosition(latlng);
					map.panTo(latlng);
				}
				$.cookie('last_lat_lng') = latlng;
			}
		});		
	}
	this.unWatchMap = function(elm){
		$(elm).gmap('clearWatch');
	}
	
	/**
	HTML5 Geolocation for rapid geocordinate lookup
	**/
	this.getMobileLatLng = function(callback){
		
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				function(position){
					var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
					callback(latlng);
				},
				function(error){
					
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
				if (status == google.maps.GeocoderStatus.OK)
					var result = results[0].formatted_address;	
				successHandler(result);
			});
		}
	}
	
	/**
	Shorthand 'getmenow'
	**/
	this.getCurrentAddress = function(callback){
		this.getMobileLatLng(function(result){
			vWorkTaxico.getStreetAddressFromLatLng(result, function(result){
				callback(result);	
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

		if (geocoder) {
			geocoder.geocode({ 'address': address }, function (results, status) {
				if (status == google.maps.GeocoderStatus.OK)
					addressList = results;
				
				callback(addressList);
			});
		}
	}
	
		
}).apply(vWorkTaxico);