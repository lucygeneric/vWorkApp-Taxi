class MainController < ApplicationController

  layout nil
  before_filter :set_api_key
  
  def index
    set_api_key
  end

  def logo
    @company = Company.find(params[:id])
    @image = @company.logo_data
    send_data(@image, :type => @company.logo_content_type, :disposition => 'inline')
  end

  def icon
    @company = Company.find(params[:id])
    @image = @company.icon_data
    send_data(@image, :type => @company.icon_content_type, :disposition => 'inline')
  end

end