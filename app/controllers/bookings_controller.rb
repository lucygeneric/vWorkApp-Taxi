class BookingsController < ApplicationController

  before_filter :set_api_key
  respond_to :json, :xml

  def show
    @booking = Booking.find(:id => params[:id])
    respond_with(@booking)
  end

  def create
    @booking = Booking.new(params[:booking])
    @booking.create
    respond_with(@booking)
  end

  def destroy
    @booking = Booking.find(:id => params[:id])
    @booking.destroy
    respond_with(@booking)
  end
  
end
