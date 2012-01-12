var vWorkTaxico = vWorkTaxico || {};

(function() {

	/**
	Core model for Knockout binding + modely things
	*****************************************************************/
	
	this.model = {
		pick_up_location_lat	: ko.observable(),
		pick_up_location_lng	: ko.observable(),
		pick_up_address			: ko.observable(),
		pick_up_time	  		: ko.observable(),
		drop_off_location_lat	: ko.observable(),
		drop_off_location_lng	: ko.observable(),
		drop_off_address  		: ko.observable(),
		driver_status			: ko.observable(),
		driver_lat				: ko.observable(),
		driver_lng				: ko.observable(),
		booking_id				: ko.observable(),
		driver_eta				: ko.observable(),
		driver_distance			: ko.observable()
	};
	
	this.getModel = function(){
		return model;
	}
	
	this.setModelValue = function(key, value){
		this.model[key](value);
	}
	
	this.initaliseModel = function(){
	
		ko.applyBindings(this.model);
		
		var pick_up_address = ($.cookie('pick_up_address')) ? $.cookie('pick_up_address') : 'Finding address...';
	
		this.model.pick_up_location_lat($.cookie('pick_up_location_lat'));
		this.model.pick_up_location_lng($.cookie('pick_up_location_lng'));		
		this.model.drop_off_location_lat($.cookie('drop_off_location_lat'));
		this.model.drop_off_location_lng($.cookie('drop_off_location_lng'));
		this.model.pick_up_address(pick_up_address);
		this.model.drop_off_address($.cookie('drop_off_address'));
		this.model.pick_up_time(new Date());
		this.model.driver_status("Connecting..");
		this.model.driver_eta("Calculating..");
	}
	
	this.cookiefyModel = function() {
    	$.cookie('pick_up_location_lat', this.model.pick_up_location_lat());
    	$.cookie('pick_up_location_lng', this.model.pick_up_location_lng());
    	$.cookie('pick_up_address', this.model.pick_up_address());
    	$.cookie('drop_off_location_lat', this.model.drop_off_location_lat());
    	$.cookie('drop_off_location_lng', this.model.drop_off_location_lng());
    	$.cookie('drop_off_address', this.model.drop_off_address());
    }



	/**
	Validation
	*****************************************************************/
	
	this.validateBookingModel = function() {
		if (this.model.pick_up_location_lat() == null)
			return "Oops, I can't seem to find your current location.<br/><br/>Try entering your current address manually.";

		if (this.model.drop_off_location_lat() == null)
			return "Oops, I can't seem to find your desired destination.<br/><br/>Try choosing a different placemark near to where you wish to go.<br/><br/>You will be able to notify the driver of your intended route on pick-up";
		
		var d = new Date();		
		if ((d.getTime() - this.model.pick_up_time().getTime()) > 600000)
			return "Hmm.. the pick-up time you have specified seems to be in the past.<br/><br/>We are sorry but our drivers are not equipped to travel at 88mph";
        
        if ((d.getTime() - this.model.pick_up_time().getTime()) < -1209600000)
			return "Hmm.. the pick-up time you have specified seems to be more than three days in the future.<br/><br/>We are hoping to have perfected teleportation by then, making your request redundant.<br/><br/>Try again with a shorter time frame.";
			
    };


	/**
	Bookings
	*****************************************************************/
    
    this.commitBooking = function(){
    
    	var when = this.model.pick_up_time();
    		when = this.ISODateString(when); 
    
    	var payload = {
    		booking: {
				drop_off_address: this.model.drop_off_address(),
				drop_off_lat: this.model.drop_off_location_lat(),
				pick_up_lat: this.model.pick_up_location_lat(),
				pick_up_address: this.model.pick_up_address(),
				when: when,
				drop_off_lng: this.model.drop_off_location_lng(),
				pick_up_lng: this.model.pick_up_location_lng()
			}	
		};
		console.log(payload);
		var url = this.bookingURL();
		this.postAsJSON(url, payload, function(result){
			//todo!! error handling
			vWorkTaxico.setModelValue("booking_id",result.booking.id);
			vWorkTaxico.watchBooking();
		});
    }
    
    this.cancelBooking = function(){
    	// cancel it on the server too, dick!
    	console.log("canceling booking. . . ");
    	vWorkTaxico.unwatchBooking();
    }
    
    this.refreshBooking = function(){
    	var url = vWorkTaxico.bookingURL() + vWorkTaxico.model.booking_id() + ".json";

    	$.get(url, function(result){
   	    	
    		vWorkTaxico.setModelValue("driver_status",result.booking.status);
    		vWorkTaxico.setModelValue("driver_lat",result.booking.driver_lat);
    		vWorkTaxico.setModelValue("driver_lng",result.booking.driver_lng);
    		//vWorkTaxico.setModelValue("driver_lat",'-36.8829472');
    		//vWorkTaxico.setModelValue("driver_lng",'174.9202712');
    		
    		vWorkTaxico.updateFromModelChange();
    	});
    	
    	vWorkTaxico.watchBooking();
    }
    
    this.bookingTimer = {};
    
    this.watchBooking = function(){
    	vWorkTaxico.bookingTimer = setTimeout(vWorkTaxico.refreshBooking, 5000);
    }
    
    this.unwatchBooking = function(){
    	clearTimeout(vWorkTaxico.bookingTimer);
    }
    
    this.bookingURL = function(){
  		return window.location.origin + "/bookings/";	
    }


	/**
	URL
	*****************************************************************/
    
    this.postAsJSON = function(url, payload, callback) {
		$.post(url, payload, function(data) {
			callback(data);
		});
	};
	

    
}).apply(vWorkTaxico);