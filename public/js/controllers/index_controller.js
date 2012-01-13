
/** HOME
/**********************************************/

$('#home').live("pagecreate", function() {

	vWorkTaxico.initaliseModel();
	
	vWorkTaxico.getCurrentAddress(function(result){
		vWorkTaxico.setModelValue('user_region_code',result.region);
		vWorkTaxico.setModelValue('pick_up_address',result.address);
		vWorkTaxico.setModelValue('pick_up_location_lat',result.lat);
		vWorkTaxico.setModelValue('pick_up_location_lng',result.lng);
	});
	
});

$('#home').live("pageshow", function() {
	var newLabelWidth = $(".menu_list").outerWidth() - 140;
	$(".menu_list > li").find('.split_button_text').css('maxWidth', newLabelWidth);
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

$('#drop_off_address_input').data('timeout', null).keyup(function(){

    clearTimeout($(this).data('timeout'));

    $(this).data('timeout', setTimeout(function(){
        vWorkTaxico.populateListFromAddressLookup($('#drop_off_address_input').val(), "drop_off");
    }, 1000));

});



/** WHEN 
/**********************************************/

$('#when').live("pagecreate", function() {
		
	$('#date_submit').click(function() {
		
		var date = $('#date_entry').data('datebox').theDate;
		var time = $('#time_entry').data('datebox').theDate;
		
		date.setHours(time.getHours(),time.getMinutes(), time.getSeconds(), time.getMilliseconds());
				
		vWorkTaxico.setModelValue('pick_up_time', date);
	});
	
});



/** BOOKING 
/**********************************************/

$('#tracking').live("pageshow", function() {
	
	vWorkTaxico.watchMap($('#map_canvas'));
	vWorkTaxico.updatePickupMarker($('#map_canvas'));
		
	/* stupid hack */
	$('#map_footer').css('display','block');
	
});

$('#tracking').live("pagehide", function() {
	vWorkTaxico.unWatchMap();
});