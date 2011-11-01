# vWorkApp Taxi App


## Bookings

### [POST] /bookings/

Creates a booking based on the posted JSON or XML. For example:

	{
	  "booking":{
	     "drop_off_address":null,
	     "contact_number":null,
	     "drop_off_lat":null,
	     "pick_up_address":"Hi there you guys!",
	     "pick_up_lat":null,
	     "driver_lng":null,
	     "id":null,
	     "when":null,
	     "drop_off_lng":null,
	     "pick_up_lng":null,
	     "status":null,
	     "driver_lat":null
	  }
	}

Returns a completed booking along with its ID.

### [GET] /bookings/[id].json

Returns the booking matching the given ID. The returned booking also includes the bookings status, and the driver, along with his lat/lng, if assigned.

## Company

TBD

## Subdomain chicanery

The URL's subdomain is used to determine correct company (and therefore vWorkApp account) that the request is for. Make sure that you use a subdomain mapping that has already been setup in:

	/admin/companies
	
And for testing on your local machine you can use the following trick to add subdomains with your localhost (which normally isn't possible). Use the domain **[my_sub].lvh.me** instead. For example:

	http://joes-taxi.lvh.me:3000/bookings/23334.json