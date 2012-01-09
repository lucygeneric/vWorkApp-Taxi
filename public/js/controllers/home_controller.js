$('#home').live("pagecreate", function() {

	vWorkTaxico.initaliseModel();
	
	vWorkTaxico.getCurrentAddress(function(result){
		console.log(result);
		vWorkTaxico.setModelValue('pick_up_address',result.address);
		vWorkTaxico.setModelValue('pick_up_location_lat',result.lat);
		vWorkTaxico.setModelValue('pick_up_location_lng',result.lng);
	});
	
});

$('#home').live("pageshow", function() {
	var newLabelWidth = $(".menu_list").outerWidth() - 130;
	console.log('setting width to '+newLabelWidth);
	$(".menu_list > li").find('.split_button_text').css('maxWidth', newLabelWidth);
	console.log($(".menu_list > li").find('.split_button_text'));
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
});