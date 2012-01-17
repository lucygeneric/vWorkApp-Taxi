class Company < ActiveRecord::Base
  
  def logo_url
    "/uploads/#{logo_filename}"
  end

  def logo_filename
    self.name.gsub(/\s/, "").underscore
  end

end
