$('#home').live("pagecreate", function() {

	vWorkTaxico.initaliseModel();
	
	vWorkTaxico.getCurrentAddress(function(result){
		vWorkTaxico.setModelValue('pick_up_address',result);
	});
	
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