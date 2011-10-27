class Booking
  include ActiveModel::Serializers::JSON
  include ActiveModel::Serializers::Xml

  attr_accessor :id, :pick_up_address, :pick_up_lat, :pick_up_lng, :drop_off_address, :drop_off_lat, :drop_off_lng, :when, :contact_number
  
  def initialize(attributes = {})  
    attributes.each do |name, value|  
      send("#{name}=", value) 
    end  
  end  
  
  def self.from_job(job)
    self.new(
      :id => job.id,
      :pick_up_address => job.steps.first.location.formatted_address,
      :pick_up_lat => job.steps.first.location.lat, 
      :pick_up_lng => job.steps.first.location.lng, 
      :drop_off_address => job.steps.last.location.formatted_address,
      :drop_off_lat => job.steps.last.location.lat, 
      :drop_off_lng => job.steps.last.location.lng,
      :when => job.planned_start_at,
      :contact_number => job.custom_fields.find {|a| a.name == "Contact" }.try(:value)
    )
  end
  
  def attributes
    {
      'id' => id, 
      'pick_up_address' => pick_up_address, 
      'pick_up_lat' => pick_up_lat, 
      'pick_up_lng' => pick_up_lng, 
      'drop_off_address' => drop_off_address, 
      'drop_off_lat' => drop_off_lat, 
      'drop_off_lng' => drop_off_lng, 
      'when' => self.when,
      'contact_number' => contact_number, 
    }
  end

  def to_job
    VWorkApp::Job.new(
      "?? Who ??",
      "Mobile Booking",
      30.minutes,
      [
        VWorkApp::Step.new("Picked Up", VWorkApp::Location.new(self.pick_up_address, 37.779536, -122.401503)),
        VWorkApp::Step.new("Droped Off", VWorkApp::Location.new(self.drop_off_address, 37.779536, -122.401503))
      ],
      [
        VWorkApp::CustomField.new("When", self.when),
        VWorkApp::CustomField.new("Contact", self.contact_number),
      ]
    )
  end
  
end