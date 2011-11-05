$('#drop_off_address_input').data('timeout', null).keyup(function(){

    clearTimeout($(this).data('timeout'));

    $(this).data('timeout', setTimeout(function(){
        vWorkTaxico.populateListFromAddressLookup($('#drop_off_address_input').val(), "drop_off");
    }, 1000));

});