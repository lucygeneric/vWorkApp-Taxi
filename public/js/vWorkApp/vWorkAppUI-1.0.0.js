var vWorkTaxico = vWorkTaxico || {};

(function() {

	/**
	Generates an unordered list from a street address.
	@param address - partial match street address
	@param target - base name for container and button targets
	TODO - remove dependency on targets
	TODO - pass in a data theme object
	*/

	this.populateListFromAddressLookup = function(address, target){
		
		var containerTarget = $("#"+target+"_container");		
		$(containerTarget).empty();
		
		vWorkTaxico.partialAddressGeocode(address, function(results){

			var addressList = '<ul id="'+target+'_list" data-role="listview" data-inset="true" data-theme="c" data-dividertheme="d">'; 
			for (var i = 0; i < results.length; i++){
				addressList +=	'<li id="li">'+results[i].formatted_address+'</li>';
			};
				
			addressList += "</ul>";	

			$(containerTarget).append(addressList);
			$("#"+target+"_list").listview();
			
			$("#"+target+"_list li").click(function(event){
				
				var ind = $("#"+target+"_list li").index(this);
				
				vWorkTaxico.setModelValue(target+'_location', results[ind].geometry.location);
				vWorkTaxico.setModelValue(target+'_address', results[ind].formatted_address);
				
				$.mobile.changePage("#home");					
			});
		});
	}
	
	
	this.getCurrentDateFromDateTimeEntry = function(dateScroller,timeScroller){
		var date = $(dateScroller).scroller('getDate');
		if (date == null)
			date = new Date();
		var time = $(timeScroller).scroller('getValue');
		date.setHours(time[0],time[1]);
		return date;
	}
	
	this.dialog = function(message) {
		$("<div class='ui-loader ui-overlay-shadow ui-body-b ui-corner-all'><h1>" + message + "</h1></div>")
		.css({
			display: "block",
			opacity: 0.96,
			top: window.pageYOffset+100
		})
		.appendTo("body").delay(800)
		.click(function(){
			$(this).remove();
		});
	}
		
}).apply(vWorkTaxico);

		
