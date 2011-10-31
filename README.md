# vWorkApp Taxi App


## Bookings

### [POST] /bookings/

Creates a booking based on the posted JSON or XML. For example:

	<booking>
	  <drop-off-address>881 Harrison St, San Francisco, CA 94107</drop-off-address>
	  <contact-number nil="true"/>
	  <drop-off-lat type="decimal">37.7793881</drop-off-lat>
	  <pick-up-lat type="decimal">37.779536</pick-up-lat>
	  <pick-up-address>880 Harrison St, San Francisco, CA 94107</pick-up-address>
	  <when type="datetime">2011-10-27T05:00:00Z</when>
	  <drop-off-lng type="decimal">-122.4013562</drop-off-lng>
	  <pick-up-lng type="decimal">-122.401503</pick-up-lng>
	</booking>

Returns a completed booking along with its ID.

### [GET] /bookings/[id].json

Returns the booking matching the given ID.

## Company

TBD

## Subdomain chicanery

The URL's subdomain is used to determine correct company (and therefore vWorkApp account) that the request is for. Make sure that you use a subdomain mapping that has already been setup in:

	/admin/companies
	
And for testing on your local machine you can use the following trick to add subdomains with your localhost (which normally isn't possible). Use the domain **[my_sub].lvh.me** instead. For example:

	http://joes-taxi.lvh.me:3000/bookings/23334.json