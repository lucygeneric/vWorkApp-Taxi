var vWorkTaxico = vWorkTaxico || {};

(function() {

	/**
	Core model for Knockout binding + modely things
	*****************************************************************/
	
	this.model = {
		user_region_code		: ko.observable(),
		contact_phone_number    : ko.observable(),
		pick_up_location_lat	: ko.observable(),
		pick_up_location_lng	: ko.observable(),
		pick_up_address			: ko.observable(),
		pick_up_time	  		: ko.observable(),
		pick_up_time_text   : ko.observable(),
		drop_off_location_lat	: ko.observable(),
		drop_off_location_lng	: ko.observable(),
		drop_off_address  		: ko.observable(),
		driver_status			: ko.observable(),
		driver_lat				: ko.observable(),
		driver_lng				: ko.observable(),
		booking_id				: ko.observable(),
		driver_eta				: ko.observable(),
		driver_eta_time   : ko.observable(),
		driver_distance			: ko.observable(),
		trip_distance			: ko.observable(),
		trip_duration			: ko.observable()
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
	
		this.model.user_region_code($.cookie('user_region_code'));
		this.model.contact_phone_number($.cookie('contact_phone_number'));
		this.model.pick_up_location_lat($.cookie('pick_up_location_lat'));
		this.model.pick_up_location_lng($.cookie('pick_up_location_lng'));		
		this.model.drop_off_location_lat($.cookie('drop_off_location_lat'));
		this.model.drop_off_location_lng($.cookie('drop_off_location_lng'));
		this.model.pick_up_address(pick_up_address);
		this.model.drop_off_address($.cookie('drop_off_address'));
		this.model.booking_id($.cookie('booking_id'));
		this.model.pick_up_time(new Date());
		this.model.driver_status("Connecting..");
		this.model.driver_eta("Not Available");
	}
	
	this.cookiefyModel = function() {
	  	$.cookie('user_region_code', this.model.user_region_code());
  		$.cookie('contact_phone_number', this.model.contact_phone_number());
    	$.cookie('pick_up_location_lat', this.model.pick_up_location_lat());
    	$.cookie('pick_up_location_lng', this.model.pick_up_location_lng());
    	$.cookie('pick_up_address', this.model.pick_up_address());
    	$.cookie('drop_off_location_lat', this.model.drop_off_location_lat());
    	$.cookie('drop_off_location_lng', this.model.drop_off_location_lng());
    	$.cookie('booking_id', this.model.booking_id());
    }



	/**
	Validation
	*****************************************************************/
	
	this.validateBookingModel = function() {
		
		var d = new Date();	
		
		if (this.model.pick_up_location_lat() == null)
			return "Oops, I can't seem to find your current location.<br/><br/>Try entering your current address manually.";

		if ((d.getTime() - this.model.pick_up_time().getTime()) > 600000)
			return "Hmm.. the pick-up time you have specified seems to be in the past.<br/><br/>We are sorry but our drivers are not equipped to travel at 88mph";
        
        if ((d.getTime() - this.model.pick_up_time().getTime()) < -1209600000)
			return "Hmm.. the pick-up time you have specified seems to be more than three days in the future.<br/><br/>We are hoping to have perfected teleportation by then, making your request redundant.<br/><br/>Try again with a shorter time frame.";
			
    };


	/**
	Bookings
	*****************************************************************/
    
    this.commitBooking = function(){
    
    	console.log("commiting booking");

    	var when = this.model.pick_up_time();
    		when = this.ISODateString(when); 
    	    	
    	vWorkTaxico.updatePointToPointDistanceMatrix(function(result){
    		var duration = (result['status'] == "OK") ? vWorkTaxico.model.trip_duration() : 7200;
	    	var payload = {
	    		booking: {
					drop_off_address: vWorkTaxico.model.drop_off_address(),
					drop_off_lat: vWorkTaxico.model.drop_off_location_lat(),
					pick_up_lat: vWorkTaxico.model.pick_up_location_lat(),
					pick_up_address: vWorkTaxico.model.pick_up_address(),
					when: when,
					drop_off_lng: vWorkTaxico.model.drop_off_location_lng(),
					pick_up_lng: vWorkTaxico.model.pick_up_location_lng(),
					estimated_trip_time: duration,
					contact_number:vWorkTaxico.model.contact_phone_number()
				}	
			};
			var url = vWorkTaxico.bookingURL();
			console.log('payload: '+payload);
			vWorkTaxico.postAsJSON(url, payload, 'POST', function(result){
				//todo!! error handling
				vWorkTaxico.setModelValue("booking_id",result.booking.id);
				vWorkTaxico.watchBooking();
				vWorkTaxico.cookiefyModel();
			});

    	});
    
    }
    
    this.cancelBooking = function(){

    	vWorkTaxico.unwatchBooking();
    	if (vWorkTaxico.bookingTimer)
			clearTimeout(vWorkTaxico.bookingTimer);
			
    	var url = vWorkTaxico.bookingURL() + vWorkTaxico.model.booking_id();
		vWorkTaxico.postAsJSON(url, {}, 'DELETE', function(result){});

    	vWorkTaxico.clearBooking();

    }
    
    this.clearBooking = function(){
    	vWorkTaxico.setModelValue("booking_id",null);
    	vWorkTaxico.setModelValue("driver_status","Connecting..");
   		vWorkTaxico.setModelValue("driver_lat",null);
   		vWorkTaxico.setModelValue("driver_lng",null);
   		vWorkTaxico.setModelValue("drop_off_location_lat",null);
   		vWorkTaxico.setModelValue("drop_off_location_lng",null);
   		vWorkTaxico.setModelValue("driver_eta","Not Available");
   		vWorkTaxico.setModelValue("driver_distance",null);
   		vWorkTaxico.setModelValue("trip_duration",null);
   		vWorkTaxico.setModelValue("trip_distance",null);
   		vWorkTaxico.setModelValue("driver_eta_time",null);
		
   		vWorkTaxico.cookiefyModel();
    }
    
    this.refreshBooking = function(){

    	if (vWorkTaxico.model.booking_id() == null)
    		return;
    
    	var url = vWorkTaxico.bookingURL() + vWorkTaxico.model.booking_id() + ".json";

    	$.get(url, function(result){
   	    	
    		vWorkTaxico.setModelValue("driver_status",result.booking.status);
    		vWorkTaxico.setModelValue("driver_lat",result.booking.driver_lat);
    		vWorkTaxico.setModelValue("driver_lng",result.booking.driver_lng);
	    	vWorkTaxico.updateFromModelChange();
	    	vWorkTaxico.watchBooking();

    	});
    	
    }
    
    this.bookingTimer;
    
    this.watchBooking = function(){
    	vWorkTaxico.bookingTimer = setTimeout(vWorkTaxico.refreshBooking, 5000);
    }
    
    this.unwatchBooking = function(){
    	clearTimeout(vWorkTaxico.bookingTimer);
    	vWorkTaxico.bookingTimer = null;
    }
    
    this.bookingURL = function(){
  		return window.location.origin + "/bookings/";	
    }
    
    this.updateFromModelChange = function(){
    
    	vWorkTaxico.updateMarkers();
				
		if (vWorkTaxico.model.driver_status() == 'Complete')
			vWorkTaxico.completeBooking();
	}
	
	this.completeBooking = function(){
		vWorkTaxico.clearBooking();
		$.mobile.changePage('#home', { transition: "flip"} );
		vWorkTaxico.dialog("Your journey is complete. Thank you for using PickupAgent.");
	}

	/**
	URL
	*****************************************************************/
    
    this.postAsJSON = function(url, payload, method, callback) {
		$.ajax({
			type: method,
			url: url,
			data: payload
		}).done(function(data) {
			callback(data);
		});
    
		//$.post(url, payload, function(data) {
			
		//});
	};
	

    
}).apply(vWorkTaxico);