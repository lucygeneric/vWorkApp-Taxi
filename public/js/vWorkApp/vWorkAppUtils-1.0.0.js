var vWorkTaxico = vWorkTaxico || {};

(function() {
	
	this.ISODateString = function(d){
		function pad(n){ return n < 10 ? '0'+ n : n }
 		return d.getUTCFullYear()+'-'
		      + pad(d.getUTCMonth()+1)+'-'
		      + pad(d.getUTCDate())+'T'
		      + pad(d.getUTCHours())+':'
		      + pad(d.getUTCMinutes())+':'
		      + pad(d.getUTCSeconds())+'Z'
	}
	
	this.generateGUID = function(){
		function S4() {
		   return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
		}
		return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
	} 
	
	this.formatTimeZoneToAddress = function(d,location){
	  
	}
		
}).apply(vWorkTaxico);