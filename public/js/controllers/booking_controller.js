$('#tracking').live("pageshow", function() {
	
	vWorkTaxico.watchMap($('#map_canvas'));
	vWorkTaxico.updatePickupMarker($('#map_canvas'));
	
	/* stupid hack */
	$('#map_footer').css('display','block');
	
});

$('#tracking').live("pagehide", function() {
	vWorkTaxico.unWatchMap();
});