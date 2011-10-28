var vWorkTaxico = vWorkTaxico || {};

(function() {

	/**
	Returns an array of addresses matched to partial entry.
	NOTE: Google abhors a partial address.
	*/

	this.populateListFromAddressLookup = function(address, target){
		
		var containerTarget = $("#"+target+"_container");		
		$(containerTarget).empty();
		
		vWorkTaxico.partialAddressGeocode(address, function(results){

			var addressList = '<ul id="'+target+'_list" data-role="listview" data-inset="true" data-theme="c" data-dividertheme="d">'; 
			for (var i = 0; i < results.length; i++){
				addressList +=	'<li><a href="#home">'+results[i].formatted_address+'</a></li>';
			};
				
			addressList += "</ul>";	

			$(containerTarget).append(addressList);
			$("#"+target+"_list").listview();
			
			$("#"+target+"_list").click(function(event){
				$("#"+target+"_button").text(event.target.textContent);
			});
		});
	}
		
}).apply(vWorkTaxico);

		
