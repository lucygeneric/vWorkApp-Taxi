var vWorkTaxico = vWorkTaxico || {};

(function() {

	this.model = { 
		pick_up_location  : ko.observable(),
		pick_up_address   : ko.observable(),
		pick_up_time	  : ko.observable(),
		drop_off_location : ko.observable(),
		drop_off_address  : ko.observable()
	};
	
	this.getModel = function(){
		return model;
	}
	
	this.setModelValue = function(key, value){
		this.model[key] = value;
	}
	
	this.initaliseModel = function(){
	
		ko.applyBindings(this.model);
	
		this.model.pick_up_location($.cookie('pick_up_location'));
		this.model.pick_up_address($.cookie('pick_up_address'));
		this.model.drop_off_location($.cookie('drop_off_location'));
		this.model.drop_off_address($.cookie('drop_off_address'));
		this.model.pick_up_time(new Date());
	}
	
	this.cookiefyModel = function() {
    	$.cookie('pick_up_location', this.model.pick_up_location);
    	$.cookie('pick_up_address', this.model.pick_up_address);
    	$.cookie('drop_off_location', this.model.drop_off_location);
    	$.cookie('drop_off_address', this.model.drop_off_address);
    }
	
	/**
	Validate model
	*/
	this.validateBookingModel = function() {
		if (this.model.pick_up_location() == null)
			return "Oops, I can't seem to find your current location.<br/><br/>Try entering your current address manually.";

		if (this.model.drop_off_location() == null)
			return "Oops, I can't seem to find your desired destination.<br/><br/>Try choosing a different placemark near to where you wish to go.<br/><br/>You will be able to notify the driver of your intended route on pick-up";
		
		var d = new Date();		
		if ((d.getTime() - this.model.pick_up_time().getTime()) > 600000)
			return "Hmm.. the pick-up time you have specified seems to be in the past.<br/><br/>We are sorry but our drivers are not equipped to travel at 88mph";
        
        if ((d.getTime() - this.model.pick_up_time().getTime()) < -1209600000)
			return "Hmm.. the pick-up time you have specified seems to be more than three days in the future.<br/><br/>We are hoping to have perfected teleportation by then, making your request redundant.<br/><br/>Try again with a shorter time frame.";
			
    };
    
    
    
    this.commitBooking = function(){
    
    	var when = this.model.pick_up_time();
    		when = this.ISODateString(when); 
    
    	var payload = {
    		booking: {
				drop_off_address: this.model.drop_off_address(),
				drop_off_lat: this.model.drop_off_location().lat(),
				pick_up_lat: this.model.pick_up_location().lat(),
				pick_up_address: this.model.pick_up_address(),
				when: when,
				drop_off_lng: this.model.drop_off_location().lng(),
				pick_up_lng: this.model.pick_up_location().lng()
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