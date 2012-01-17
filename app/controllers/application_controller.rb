class ApplicationController < ActionController::Base
  # protect_from_forgery

  def set_api_key
    @company = Company.where(:subdomain => request.subdomain).first
    VWorkApp.api_key = @company.api_key
    # TODO FIXME REMOVEME - temp for staging declineable
    VWorkApp::Job.base_uri 'api.staging.vworkapp.com/api/2.0'
  end

end
