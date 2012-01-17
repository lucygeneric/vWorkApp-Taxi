class Company < ActiveRecord::Base
  
  # def logo_url
  #   "/uploads/#{logo_filename}"
  # end
  # 
  # def logo_filename
  #   self.name.gsub(/\s/, "").underscore
  # end
  
  def logo=(data)
    self.logo_content_type = data.content_type.chomp
    self.logo_data = data.read
  end

end
