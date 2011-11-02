var vWorkTaxico = vWorkTaxico || {};

(function() {

	/**
	Basic model methods
	*/

	this.validateBookingModel = function() {
		
		var pick_up_coordinates = $(document).data('pick_up_location');
		var drop_off_coordinates = $(document).data('drop_off_location');
		var pickup_time = $(document).data('pickup_time');
		if (pickup_time == null)
			pickup_time = new Date();
		
		if (pick_up_coordinates == null)
			return "Oops, I can't seem to find your current location.<br/><br/>Try entering your current address manually.";

		if (drop_off_coordinates == null)
			return "Oops, I can't seem to find your desired destination.<br/><br/>Try choosing a different placemark near to where you wish to go.<br/><br/>You will be able to notify the driver of your intended route on pick-up";
		
		var d = new Date();		
		if ((d.getTime() - pickup_time.getTime()) > 600000)
			return "Hmm.. the pick-up time you have specified seems to be in the past.<br/><br/>We are sorry but our drivers are not equipped to travel at 88mph";
        
        console.log((d.getTime() - pickup_time.getTime()));
        
        if ((d.getTime() - pickup_time.getTime()) < -1209600000)
			return "Hmm.. the pick-up time you have specified seems to be more than three days in the future.<br/><br/>We are hoping to have perfected teleportation by then, making your request redundant.<br/><br/>Try again with a shorter time frame.";
			
    };
    
    this.cookiefy = function() {
    	$.cookie('pick_up_location', $(document).data('pick_up_location'));
    	$.cookie('pick_up_address', $(document).data('pick_up_address'));
    	$.cookie('drop_off_location', $(document).data('drop_off_location'));
    	$.cookie('drop_off_address', $(document).data('drop_off_address'));
    }
    
    this.commitBooking = function(){
    
    	var pickUpLocation 	= $(document).data('pick_up_location');
    	var pickUpAddress 	= $(document).data('pick_up_address');
    	var dropOffLocation = $(document).data('drop_off_location');
    	var dropOffAddress  = $(document).data('drop_off_address');
    	var when			= $(document).data('pick_up_time');
    	console.log(pickUpLocation);
    		when 			= this.ISODateString(when); 
    
    	var payload = {
    		booking: {
				drop_off_address: dropOffAddress,
				drop_off_lat: dropOffLocation.lat(),
				pick_up_lat: pickUpLocation.lat(),
				pick_up_address: pickUpAddress,
				when: when,
				drop_off_lng: dropOffLocation.lng(),
				pick_up_lng: pickUpLocation.lng()
			}	
		};
		var url = this.bookingURL();
		console.log(url);
		this.postAsJSON(url, payload, function(result){
			console.log(result);
		});
		    	
    }
    
    this.bookingURL = function(){
  		// durr we are on this domain
    	//var re = new RegExp("/(?:http://)?(?:([^.]+)\.)?lvh.me", "g");
    	//var subDomain = re.exec(window.location)[1].replace("/","");
    	return window.location.origin + "/bookings/";	
    }
    
    this.postAsJSON = function(url, payload, callback) {
		$.post(url, payload, function(data) {
			callback(data);
		});
	};
	

    
}).apply(vWorkTaxico);