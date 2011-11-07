class CallCenter::RoutingController < ApplicationController

  layout nil

  respond_to :html

  def index
    xml = <<-EOL
      <Response>
          <Say>Welcome to Joes Taxi. Please press to</Say>
          <Dial>
              <Client>jenny</Client>
          </Dial>
      </Response>
    EOL
        
    render :text => xml, :content_type => "text/xml"
  end
  
end
