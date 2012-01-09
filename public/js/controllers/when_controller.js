$('#when').live("pagecreate", function() {
		
	$('#date_submit').click(function() {
		
		var date = $('#date_entry').data('datebox').theDate;
		var time = $('#time_entry').data('datebox').theDate;
		
		date.setHours(time.getHours(),time.getMinutes(), time.getSeconds(), time.getMilliseconds());
		
		console.log("pickup time to be "+date);
		
		vWorkTaxico.setModelValue('pick_up_time', date);
	});
	
});