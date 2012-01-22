class Company < ActiveRecord::Base
    
  def logo=(data)
    self.logo_content_type = data.content_type.chomp
    self.logo_data = data.read
  end

  def icon=(data)
    self.icon_content_type = data.content_type.chomp
    self.icon_data = data.read
  end

end
