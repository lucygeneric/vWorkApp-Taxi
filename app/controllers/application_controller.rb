class ApplicationController < ActionController::Base
  # protect_from_forgery

  def set_api_key
    @company = Company.where(:subdomain => request.subdomain).first
    VWorkApp.api_key = @company.api_key
  end

end
