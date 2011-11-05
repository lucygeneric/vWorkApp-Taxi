var vWorkTaxico = vWorkTaxico || {};

(function() {

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
				
				vWorkTaxico.setModelValue(target+'_location_lat', results[ind].geometry.location.lat());
				vWorkTaxico.setModelValue(target+'_location_lng', results[ind].geometry.location.lng());
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
	
	this.dialogShown = false;
	
	this.dialog = function(message, timeout) {
	
		if (vWorkTaxico.dialogShown)
			return;
			
		if (timeout)
			setTimeout(vWorkTaxico.removeDialog, timeout);
	
		$("<div id='alert_dialog' class='ui-loader ui-overlay-shadow ui-body-b ui-corner-all'><h1>" + message + "</h1></div>")
		.css({
			display: "block",
			opacity: 0.96,
			top: window.pageYOffset+100
		})
		.appendTo("body").delay(800)
		.click(function(){
			vWorkTaxico.removeDialog();
		});
		
		vWorkTaxico.dialogShown = true;
	}
	
	this.removeDialog = function(){
		$('#alert_dialog').remove();
		vWorkTaxico.dialogShown = false;
	}
	
	this.showStatus = function(){
		var eta = vWorkTaxico.model.driver_eta();
		var distance = vWorkTaxico.model.driver_distance();
		var e = "Your driver is "+distance+" away. <br/><br />Estimated time to arrival is<br />"+eta+".";
		if (!distance)
			e = "We are unable to calculate the status of your driver at this time. <br/><br />Please try again soon.";
		vWorkTaxico.dialog(e, 5000);
	}
	
	this.updateFromModelChange = function(){
		vWorkTaxico.updatePickupMarker($('#map_canvas'));
		vWorkTaxico.updateDriverMarker($('#map_canvas'));
		vWorkTaxico.updateDistanceMatrix($('#map_canvas'));
	}
	
		
}).apply(vWorkTaxico);

		
