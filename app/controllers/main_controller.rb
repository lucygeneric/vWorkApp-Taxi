class MainController < ApplicationController

  layout nil
  before_filter :set_api_key
  
  def index
    set_api_key
  end

end