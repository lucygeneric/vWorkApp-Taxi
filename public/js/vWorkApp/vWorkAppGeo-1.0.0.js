var vWorkTaxico = vWorkTaxico || {};

(function() {

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