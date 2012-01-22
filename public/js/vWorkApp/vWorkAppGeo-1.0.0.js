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
		
		$('#map_canvas').gmap('addMarker', { 'id': 'pick_up_location', 'position': latlng, 'bounds': false, 'icon':'images/pickup-icon.png', 'visible':false });
		$('#map_canvas').gmap('addMarker', { 'id': 'drop_off_location', 'position': latlng, 'bounds': false, 'icon':'images/dropoff-icon.png', 'visible':false });
		$('#map_canvas').gmap('addMarker', { 'id': 'cab', 'position': latlng, 'bounds': false, 'icon':'images/vehicle-icon.png', 'visible':false });
		
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
	Update all markers
	*/
	this.updateMarkers = function(){
		vWorkTaxico.updatePickupMarker();
		vWorkTaxico.updateDropoffMarker();
		vWorkTaxico.updateDriverMarker();
		vWorkTaxico.updateDriverToClientDistanceMatrix();
	}
	
	/**
	Hide the markers
	*/
	this.removeAllMarkers = function(){
		$('#map_canvas').gmap('get', 'markers > pick_up_location').setVisible(false);
		$('#map_canvas').gmap('get', 'markers > drop_off_location').setVisible(false);	
		$('#map_canvas').gmap('get', 'markers > cab').setVisible(false);	
	}	
	
		
	/**
	Calculate the distance matrix
	*/
	this.updateDistanceMatrix = function(origin_latlng,destination_latlng,callback){
				
		var service = new google.maps.DistanceMatrixService();
		service.getDistanceMatrix({
			origins: [origin_latlng],
			destinations: [destination_latlng],
			travelMode: google.maps.TravelMode.DRIVING,
	        unitSystem: google.maps.UnitSystem.METRIC,
    	    avoidHighways: false,
        	avoidTolls: false
		}, distanceCallback);
		
		function distanceCallback(result, status) {
				
			if (result.rows[0].elements[0].status == "ZERO_RESULTS"){
				callback({'status':'ZERO_RESULTS'});
				return;
			}
			
			callback({
				'status'  : 'OK',
				'distance':result.rows[0].elements[0].distance.text, 
				'duration_text':result.rows[0].elements[0].duration.text,
				'duration_value':result.rows[0].elements[0].duration.value
			});

		}
	}
	
	/**
	Get driver-to-client distance matrix
	*/
	this.updateDriverToClientDistanceMatrix = function(){
		var origin_latlng = new google.maps.LatLng(vWorkTaxico.model.driver_lat(),vWorkTaxico.model.driver_lng());
		var destination_latlng = new google.maps.LatLng(vWorkTaxico.model.pick_up_location_lat(),vWorkTaxico.model.pick_up_location_lng());
	
		if ((origin_latlng.lat() == 0) || (destination_latlng.lat() == 0))
			return;

		this.updateDistanceMatrix(origin_latlng,destination_latlng,function(result){
			vWorkTaxico.setModelValue('driver_distance',result.distance);
			vWorkTaxico.setModelValue('driver_eta',result.duration_text);			
		});

	}

	/**
	Get point-to-point distance matrix
	*/
	this.updatePointToPointDistanceMatrix = function(callback){
		var origin_latlng = new google.maps.LatLng(vWorkTaxico.model.pick_up_location_lat(),vWorkTaxico.model.pick_up_location_lng());
		var destination_latlng = new google.maps.LatLng(vWorkTaxico.model.drop_off_location_lat(),vWorkTaxico.model.drop_off_location_lng());
	
		if ((origin_latlng.lat() == 0) || (destination_latlng.lat() == 0)){
			callback({'status':'ZERO_RESULTS'});
			return;	
		}

		this.updateDistanceMatrix(origin_latlng,destination_latlng,function(result){
			vWorkTaxico.setModelValue('trip_distance',result.distance);
			vWorkTaxico.setModelValue('trip_duration',result.duration_value);			
			callback({'status':result.status});
		});

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
	this.beginTracking = function(){
	
		vWorkTaxico.updateMarkers();	

		//center the map
		var latlng = new google.maps.LatLng(vWorkTaxico.model.pick_up_location_lat(),vWorkTaxico.model.pick_up_location_lng());	
		$('#map_canvas').gmap('get', 'map').panTo(latlng);
		$('#map_canvas').gmap('get', 'map').setZoom(13);
		
		$('#map_canvas').gmap('refresh');
		vWorkTaxico.trackMap();
		
	}
	
	this.endTracking = function(){
		vWorkTaxico.removeAllMarkers();
		vWorkTaxico.untrackMap();	
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