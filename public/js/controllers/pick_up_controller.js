$('#pick_up_address_input').data('timeout', null).keyup(function(){
	
    clearTimeout($(this).data('timeout'));

    $(this).data('timeout', setTimeout(function(){
        vWorkTaxico.populateListFromAddressLookup($('#pick_up_address_input').val(), "pick_up");
    }, 1000));

}); 