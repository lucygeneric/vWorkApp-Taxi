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
    
}).apply(vWorkTaxico);