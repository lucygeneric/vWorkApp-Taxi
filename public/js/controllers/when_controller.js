$('#when').live("pagecreate", function() {
	
	$('#time_entry').scroller({ preset: 'time', theme: 'ios', ampm: false });
	$('#date_entry').scroller({ preset: 'date', theme: 'ios' });
	
	$('#date_submit').click(function() {
		var date = vWorkTaxico.getCurrentDateFromDateTimeEntry($('#date_entry'),$('#time_entry'));
		vWorkTaxico.setModelValue('pick_up_time', date);
	});
	
});