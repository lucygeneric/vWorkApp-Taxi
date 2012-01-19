var vWorkTaxico = vWorkTaxico || {};

(function() {

	/**
	Instances GMAP
	*/
	this.generateBaseMap = function(){
	
		// todo - refactor me out of this fucking thing - not the responsibility of 'generateBaseMap'
		var lastLat = $.cookie('last_lat');
		var lastLng = $.cookie('last_lng');
		var latlng = new google.maps.LatLng(lastLat,lastLng);
		if (lastLat == null)
			latlng = new google.maps.LatLng('37.752296', '-122.447447');
	
		$('#map_canvas').gmap({'center': latlng, 'mapTypeId':  google.maps.MapTypeId.ROADMAP, 'zoom': 5});
		
		$('#map_canvas').gmap('addMarker', { 'id': 'pick_up_location', 'position': latlng, 'bounds': false, 'icon':'images/flag-export.png', 'visible':false });
		$('#map_canvas').gmap('addMarker', { 'id': 'drop_off_location', 'position': latlng, 'bounds': false, 'icon':'images/flag-drop-off.png', 'visible':false });
		$('#map_canvas').gmap('addMarker', { 'id': 'cab', 'position': latlng, 'bounds': false, 'icon':'images/taxi.png', 'visible':false });
		$('#map_canvas').gmap('addMarker', { 'id': 'client', 'position': latlng, 'bounds': false, 'icon':'images/male.png', 'visible':false });
		
		$('#map_canvas').gmap().bind('init', function(ev, map) {	        
	        google.maps.event.trigger(map, 'resize')
	    });
	}
	
	/**
	Update pickup marker
	*/
	this.updatePickupMarker = function(){
		var latlng = new google.maps.LatLng(vWorkTaxico.model.pick_up_location_lat(),vWorkTaxico.model.pick_up_location_lng());	
		var marker = $('#map_canvas').gmap('get', 'markers > pick_up_location');
		$('#map_canvas').gmap('get', 'map').panTo(latlng);
		marker.setVisible(true);
		marker.setPosition(latlng);
	}
	
	/**
	Update dropoff marker
	*/
	this.updateDropoffMarker = function(){
		var latlng = new google.maps.LatLng(vWorkTaxico.model.drop_off_location_lat(),vWorkTaxico.model.drop_off_location_lng());	
		var marker = $('#map_canvas').gmap('get', 'markers > drop_off_location');	
		if (latlng.lat() == 0){
			marker.setVisible(false);
			return;
		}
		marker.setVisible(true);
		marker.setPosition(latlng);
	}
		
	/**
	Update driver marker
	*/
	this.updateDriverMarker = function(){
		var latlng = new google.maps.LatLng(vWorkTaxico.model.driver_lat(),vWorkTaxico.model.driver_lng());		
		var marker = $('#map_canvas').gmap('get', 'markers > cab');	
		if (latlng.lat() == 0){
			marker.visible = false;
			return;
		}
		marker.setVisible(true);
		marker.setPosition(latlng);
	}
	
	/**
	Hide the markers
	*/
	this.removeAllMarkers = function(){
		$('#map_canvas').gmap('get', 'markers > pick_up_location').setVisible(false);
		$('#map_canvas').gmap('get', 'markers > drop_off_location').setVisible(false);	
		$('#map_canvas').gmap('get', 'markers > cab').setVisible(false);	
		$('#map_canvas').gmap('get', 'markers > client').setVisible(false);	
	}	
	
		
	/**
	Calculate the distance matrix
	*/
	this.updateDistanceMatrix = function(){
	
		var origin_latlng = new google.maps.LatLng(vWorkTaxico.model.driver_lat(),vWorkTaxico.model.driver_lng());
		var destination_latlng = new google.maps.LatLng(vWorkTaxico.model.pick_up_location_lat(),vWorkTaxico.model.pick_up_location_lng());
	
		if ((origin_latlng.lat() == 0) || (destination_latlng.lat() == 0))
			return;
			
		var service = new google.maps.DistanceMatrixService();
		service.getDistanceMatrix({
			origins: [origin_latlng],
			destinations: [destination_latlng],
			travelMode: google.maps.TravelMode.DRIVING,
	        unitSystem: google.maps.UnitSystem.METRIC,
    	    avoidHighways: false,
        	avoidTolls: false
		}, callback);
		
		function callback(result, status) {
			console.log(status);
			console.log(result);
		
			if (result.rows[0].elements[0].status == "ZERO_RESULTS")
				return;
			
			vWorkTaxico.setModelValue('driver_distance',result.rows[0].elements[0].distance.text);
			vWorkTaxico.setModelValue('driver_eta',result.rows[0].elements[0].duration.text);
		}
	}
	
	/**
	Track map control, write to cookie
	*/
	this.draglistener = {};
	
	this.trackMap = function(){
		draglistener = google.maps.event.addListener($('#map_canvas').gmap('get', 'map'),'dragend', function(event){
			var latLng = $('#map_canvas').gmap('get', 'map').getCenter();
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
	this.watchMap = function(){
	
		/*if(navigator.geolocation){
			var options = {timeout:10000};
			this.geoLoc = navigator.geolocation;
			this.watchID = this.geoLoc.watchPosition(this.showLocation, 
            	                           this.errorHandler,
                 	                       options);
		}*/				
		
		$('#map_canvas').gmap('refresh');
		vWorkTaxico.trackMap();
		
	}
	
	this.showLocation = function(position){
		var latitude = position.coords.latitude;
		var longitude = position.coords.longitude;
		$('#map_canvas').gmap('get', 'markers > client').setPosition(new google.maps.LatLng(latitude, longitude));
		$('#map_canvas').gmap('get', 'markers > client').setVisible(true);
	}

	this.errorHandler = function(err) {	
		console.log(err);
	}
		
	
	this.unWatchMap = function(){

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

		console.log($(document).find('.loading-widget img'));
		$(document).find('.loading-widget img').css('display', 'block');

		var geocoder = new google.maps.Geocoder();
		var addressList = [];
		var request_payload = { 'address': address };
		if (this.model.user_region_code() != null) request_payload['region'] = this.model.user_region_code();
		if (geocoder) {
			geocoder.geocode(request_payload, function (results, status) {
				addressList = [];		
				if (status == google.maps.GeocoderStatus.OK){
					for (var i = 0; i < 3; i++){
						if (results[i])
							addressList.push(results[i]);
					}	
				}
				$(document).find('.loading-widget img').css('display','none');
				callback(addressList);
			});
		}
	}
	
		
}).apply(vWorkTaxico);