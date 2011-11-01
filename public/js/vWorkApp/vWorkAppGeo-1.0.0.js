var vWorkTaxico = vWorkTaxico || {};

(function() {

	/**
	Instances GMAP
	Requires: jquery.cookie.js
	*/
	
	this.generateBaseMap = function(elm){
	
		//var latlng = $.cookie('last_lat_lng');
		//if (latlng == null)
			var latlng = new google.maps.LatLng('37.752296', '-122.447447');
	
		$(elm).gmap({'center': latlng, 'mapTypeId':  google.maps.MapTypeId.ROADMAP, 'zoom': 8});
		
		$(elm).gmap().bind('init', function(ev, map) {
	        $(elm).gmap('addMarker', { 'position': latlng, 'bounds': true }).click(function() {
	            $(elm).gmap('openInfoWindow', { 'content': 'Me!' }, this);
	        });
	    });
		
	}
	
	/**
	Watches the map for positional changes
	*/
	
	this.watchMap = function(elm){
	
		
		 google.maps.event.trigger(elm, 'resize');
		 console.log('watching map');
	
			return;

	
		$(elm).gmap('watchPosition', function(position, status) {
			console.log('Watch position has status '+status);
			if ( status === 'OK' ) {
				var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
				var marker = $('#map_canvas').gmap('get', 'markers > client' );
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
	
	/**
	Stops watching
	**/
	
	this.unWatchMap = function(elm){
		$(elm).gmap('clearWatch');
	}
	
	/**
	HTML5 Geolocation for rapid geocordinate lookup
	**/
	
	this.getMobileLatLng = function(callback){
	
		// REMOVE ME!!! !!! !!!
		var latlng = new google.maps.LatLng('37.75329600', '-122.44744700');
		callback(latlng);		
		return;
		// END REMOVE ME !!!!!!
	
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