class CallCenter::RoutingController < ApplicationController

  layout nil
  respond_to :html

  def entry
    xml = <<-EOL
<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Gather action="/routing/redirect" method="GET">
      <Say>
        Welcome to Joe's Taxi. 
        Press 1 to make a booking. 
        Press 2 to get a status update.
      </Say>
  </Gather>
  <Say>We didn't receive any input. Goodbye!</Say>
</Response>
EOL

    render :text => xml, :content_type => "text/xml"
  end

  def redirect
    xml = case params[:digits]
    when "1"
      to_call
    else "2"
      get_status
    end
      
    render :text => xml, :content_type => "text/xml"
  end
    
  private 
  
  def get_status
    to_call = <<-EOL
<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Dial>
        <Client>jenny</Client>
    </Dial>
</Response>
EOL
  end

  def to_call
    <<-EOL
<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say>
    You booking is complete!
  </Say>
</Response>
EOL
  end
    
end
