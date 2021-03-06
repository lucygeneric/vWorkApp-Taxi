class CallCenter::BookingsController < ApplicationController

  respond_to :html
  layout nil

  def index
    @booking = Booking.new
    respond_with(@booking)
  end

  def create
    @booking = Booking.new(params[:booking])
    @booking.ticket_id = @booking.contact_number
    create_job(@booking)
    respond_with([:call_center, @booking])
  end

  # def show
  #   @booking = Booking.from_job(params[:id])
  #   respond_with(@booking)
  # end

  # <booking>
  #   <drop-off-address>881 Harrison St, San Francisco, CA 94107</drop-off-address>
  #   <contact-number nil="true"/>
  #   <drop-off-lat type="decimal">37.7793881</drop-off-lat>
  #   <pick-up-lat type="decimal">37.779536</pick-up-lat>
  #   <pick-up-address>880 Harrison St, San Francisco, CA 94107</pick-up-address>
  #   <when type="datetime">2011-10-27T05:00:00Z</when>
  #   <drop-off-lng type="decimal">-122.4013562</drop-off-lng>
  #   <pick-up-lng type="decimal">-122.401503</pick-up-lng>
  # </booking>
  # def create
  #   p params
  #   @booking = Booking.new(params[:booking])
  #   create_job(@booking)
  #   respond_with(@booking)
  # end

  # def destroy
  # end

  # private
  # 
  # def create_job(booking)
  #   job = booking.to_job
  #   job = job.create
  #   booking.id = job.id
  # end
  # 
  # def set_api_key
  #   @company = Company.where(:subdomain => request.subdomain).first
  #   VWorkApp.api_key = @company.api_key
  # end

  private

  def create_job(booking)
    VWorkApp.api_key = "AtuogECLCV2R7uT-fkPg"
    job = booking.to_job
    job = job.create
    booking.id = job.id
  end
  
  
end
