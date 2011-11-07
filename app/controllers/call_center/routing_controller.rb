class CallCenter::RoutingController < ApplicationController

  respond_to :html

  def index
    xml = <<-EOL
      <Response>
          <Say>Hello World</Say>
          <Dial>
              <Client>jenny</Client>
          </Dial>
      </Response>
    EOL
        
    render :text => xml, :content_type => "text/xml"
  end
  
end
