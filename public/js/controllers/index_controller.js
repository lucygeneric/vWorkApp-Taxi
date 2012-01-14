
/** INITIALISATION
/**********************************************/

$('#startup').live("pagecreate", function() {	
	vWorkTaxico.validateEntry("#home");
});

/** HOME
/**********************************************/

$('#home').live("pagecreate", function() {
	console.log("create");
	vWorkTaxico.validateEntry("#home");

	vWorkTaxico.getCurrentAddress(function(result){
		vWorkTaxico.setModelValue('user_region_code',result.region);
		vWorkTaxico.setModelValue('pick_up_address',result.address);
		vWorkTaxico.setModelValue('pick_up_location_lat',result.lat);
		vWorkTaxico.setModelValue('pick_up_location_lng',result.lng);
	});
	
});

$('#home').live("pageshow", function() {
	var newLabelWidth = $(".menu_list").outerWidth() - 170;
	$(".menu_list > li").find('.split_button_text').css('maxWidth', newLabelWidth);
	
	vWorkTaxico.forceUpdateUI();
});


$('#request_submit').click(function(event) {
			
	var e = vWorkTaxico.validateBookingModel();

	if (e != null){
		vWorkTaxico.dialog(e);
		event.preventDefault();
		event.stopImmediatePropagation();
	}
	
	vWorkTaxico.cookiefyModel();
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



/** WHEN 
/**********************************************/

$('#when').live("pagecreate", function() {

	vWorkTaxico.validateEntry('#when');
		
	$('#date_submit').click(function() {
		
		var date = $('#date_entry').data('datebox').theDate;
		var time = $('#time_entry').data('datebox').theDate;
		
		date.setHours(time.getHours(),time.getMinutes(), time.getSeconds(), time.getMilliseconds());
				
		vWorkTaxico.setModelValue('pick_up_time', date);
	});
	
});


$('#when').live("pageshow", function() {
	vWorkTaxico.forceUpdateUI();
});




/** BOOKING 
/**********************************************/

$('#tracking').live("pagecreate", function() {
	vWorkTaxico.validateEntry('#tracking');
	vWorkTaxico.generateBaseMap($('#map_canvas'));
});
	

$('#tracking').live("pageshow", function() {
	
	vWorkTaxico.watchMap($('#map_canvas'));
	vWorkTaxico.updatePickupMarker($('#map_canvas'));
	
	var height = $("#tracking").height() - 85;
	$('#map_canvas').height(height);
	google.maps.event.trigger($('#map_canvas'), 'resize');			
	/* stupid hack */
	$('#map_footer').css('display','block');
	
	vWorkTaxico.forceUpdateUI();
});

$('#tracking').live("pagehide", function() {
	vWorkTaxico.unWatchMap();
});