class Booking
  include ActiveModel::Serializers::JSON
  include ActiveModel::Serializers::Xml
  extend ActiveModel::Naming 
  include ActiveModel::Conversion

  attr_accessor :id, :pick_up_address, :pick_up_lat, :pick_up_lng, :drop_off_address, :drop_off_lat, :drop_off_lng, :when, :contact_number, :ticket_id
  attr_accessor :status, :driver_lat, :driver_lng
  
  def initialize(attributes = {})  
    attributes.each do |name, value|  
      send("#{name}=", value) 
    end  
  end  
  
  # Take an options hash. Needs to contain one of:
  #   :id
  #   :ticket_id
  def self.from_job(opts)
    job = if (opts.has_key?(:id))
        VWorkApp::Job.show(opts[:id])
      else
        VWorkApp::Job.find(:third_party_id => opts[:ticket_id]).first
    end
    
    booking = self.new(
      :id => job.id,
      :pick_up_address => job.steps.first.location.formatted_address,
      :pick_up_lat => job.steps.first.location.lat, 
      :pick_up_lng => job.steps.first.location.lng, 
      :drop_off_address => job.steps.last.location.formatted_address,
      :drop_off_lat => job.steps.last.location.lat, 
      :drop_off_lng => job.steps.last.location.lng,
      :when => job.planned_start_at,
      :contact_number => job.custom_fields.find {|a| a.name == "Contact" }.try(:value),
      :ticket_id => job.third_party_id
    )
    
    booking.status = case job.progress_state
      when "not_started"
        job.assigned_to.nil? ? "With Dispatcher" : "With Driver"
      when "started"
        "On Route"
      when "completed"
        "Complete"
    end
    
    if job.assigned_to && (loc = job.assigned_to.latest_telemetry)
      booking.driver_lat = loc.lat
      booking.driver_lng = loc.lng
    end
    booking
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
      'status' => status,
      'driver_lat' => driver_lat,
      'driver_lng' => driver_lng,
      'ticket_id' => ticket_id
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
      ],
      nil,
      self.ticket_id
    )
  end
  
  # Needed to make work with action_view's form_for
  def persisted?
    false
  end
  
end