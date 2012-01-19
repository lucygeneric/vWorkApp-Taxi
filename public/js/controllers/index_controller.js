
/** INITIALISATION
/**********************************************/

$('#startup').live("pagecreate", function() {	
	vWorkTaxico.validateEntry("#home");
});

/** HOME
/**********************************************/

$('#home').live("pagecreate", function() {
	
	vWorkTaxico.validateEntry("#home");
	
	vWorkTaxico.getCurrentAddress(function(result){
		vWorkTaxico.setModelValue('user_region_code',result.region);
		vWorkTaxico.setModelValue('pick_up_address',result.address);
		vWorkTaxico.setModelValue('pick_up_location_lat',result.lat);
		vWorkTaxico.setModelValue('pick_up_location_lng',result.lng);
	});
	
	$("#cancel_booking").click(function(){
		vWorkTaxico.cancelBooking();
		$("#active_booking").fadeOut('fast', function(){
			$("#make_booking").fadeIn('fast');
		});
		
	});
	
	$('#logo').load( function() {
		var h = 75 - ($(this).height() / 2);
		$("#logo").attr("style", "padding-top:"+ h + "px");
	}).attr('src', $('logo').attr('src'));

			
});

$('#home').live("pagebeforeshow", function() {
	var has_booking = (vWorkTaxico.model.booking_id() != null);
	
	$("#active_booking").css("display",(has_booking) ? "block" : "none");
	$("#make_booking").css("display",(has_booking) ? "none" : "block");
	
	if (has_booking)
		vWorkTaxico.watchBooking();
	
	vWorkTaxico.forceUpdateUI();
	
});

$('#home').live("pageshow", function() {
	var newLabelWidth = $("#menu_list").outerWidth() - 170;
	$("#menu_list > li").find('.split_button_text').css('maxWidth', newLabelWidth);	
});


$('#request_submit').click(function(event) {

	var e = vWorkTaxico.validateBookingModel();

	if (e != null){
		vWorkTaxico.dialog(e);
		event.preventDefault();
		event.stopImmediatePropagation();
		return;
	}
	
	vWorkTaxico.commitBooking();
});

$('input[type=text]').focus(function() {
	$(this).val('');
	// whats this????
});



/** PICKUP 
/**********************************************/

$('#pick_up').live("pagecreate", function() {
	vWorkTaxico.validateEntry("#pick_up");
	// override default UI behavior. JQM does its best to override me.
	$("#pick_up_address_input").css('width',"100%");
});


$('#pick_up').live("pageshow", function() {
	vWorkTaxico.forceUpdateUI();
});


$('#pick_up_address_input').data('timeout', null).keyup(function(){
	
    clearTimeout($(this).data('timeout'));

    $(this).data('timeout', setTimeout(function(){
        vWorkTaxico.populateListFromAddressLookup($('#pick_up_address_input').val(), "pick_up");
    }, 1000));

}); 

$('#use_current_location_button').click(function(){
	
	vWorkTaxico.getCurrentAddress(function(result){
		vWorkTaxico.setModelValue('pick_up_address',result.address);
		vWorkTaxico.setModelValue('pick_up_location_lat',result.lat);
		vWorkTaxico.setModelValue('pick_up_location_lng',result.lng);
	});
	
});


/** DROP-OFF 
/**********************************************/

$('#drop_off').live("pagecreate", function() {
	vWorkTaxico.validateEntry("#drop_off");
	// override default UI behavior. JQM does its best to override me.
	$("#drop_off_address_input").css('width',"100%");
});

$('#drop_off').live("pageshow", function() {
	vWorkTaxico.forceUpdateUI();
});


$('#drop_off_address_input').data('timeout', null).keyup(function(){

    clearTimeout($(this).data('timeout'));

    $(this).data('timeout', setTimeout(function(){
        vWorkTaxico.populateListFromAddressLookup($('#drop_off_address_input').val(), "drop_off");
    }, 1000));

});

$('#use_no_location_button').click(function(){
	
	vWorkTaxico.setModelValue('drop_off_address','');
	vWorkTaxico.setModelValue('drop_off_location_lat',null);
	vWorkTaxico.setModelValue('drop_off_location_lng',null);
	
});



/** WHEN 
/**********************************************/

$('#when').live("pagecreate", function() {

	vWorkTaxico.validateEntry('#when');
	
	// override default UI behavior. JQM does its best to override me.
	$("#date_entry").css('width',"100%");
	$("#time_entry").css('width',"100%");

		
	$('#date_submit').click(function() {
		
		var date = $('#date_entry').data('datebox').theDate;
		var time = $('#time_entry').data('datebox').theDate;
		
		date.setHours(time.getHours(),time.getMinutes(), time.getSeconds(), time.getMilliseconds());
				
		vWorkTaxico.setModelValue('pick_up_time', date);
	});
	
	$('#date_entry').click(function(){
		$('#date_entry').datebox('open');
	});
	
	$('#time_entry').click(function(){
		$('#time_entry').datebox('open');
	});
	
});


$('#when').live("pageshow", function() {
	vWorkTaxico.forceUpdateUI();
});




/** BOOKING 
/**********************************************/

$('#tracking').live("pagecreate", function() {
	
	vWorkTaxico.validateEntry('#home');
	vWorkTaxico.generateBaseMap();
	$("#map_cancel_booking").click(function(){
		vWorkTaxico.cancelBooking();
		history.back();
	});
	
	$("#map_show_status").click(function(){
		vWorkTaxico.showStatus();
	});

});
	

$('#tracking').live("pageshow", function() {
	vWorkTaxico.watchMap();
	vWorkTaxico.updatePickupMarker();	
	vWorkTaxico.updateDropoffMarker();
	vWorkTaxico.forceUpdateUI();
});

$('#tracking').live("pagehide", function() {
	vWorkTaxico.unWatchMap();
});