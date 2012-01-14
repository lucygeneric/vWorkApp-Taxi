var vWorkTaxico = vWorkTaxico || {};

/* setup rudimentary session key, is the app running? */
vWorkTaxico.session_key;

/* JQM configuration */
$(document).bind("mobileinit", function(){
  $.extend(  $.mobile , {
    touchOverflowEnabled: true,
    ajaxLinksEnabled: false,
  });
});



// this attempts to workaround a problem with JQM. I was sometimes getting strange
// behavior with the fixed header and footer. They would sometimes hang in the middle
// of the page or disappear altogether. After some digging in the JQM sources, I found 
// the $.fixedToolbars function that appears to control these. The show command will force 
// them to display, so i tied that to the window.scroll() event.
$(window).scroll( function(){   
	$(document).find("[data-role=header],[data-role=footer]").css("z-index","1000");
	$.mobile.fixedToolbars.show(true);
});