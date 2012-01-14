class MainController < ApplicationController

  before_filter :set_api_key
  
  def index
    set_api_key
    # render :app
  end

end