class Booking
  include ActiveModel::Serializers::JSON
  include ActiveModel::Serializers::Xml
  extend  ActiveModel::Naming 
  include ActiveModel::Conversion

  attr_accessor :id, :pick_up_address, :pick_up_lat, :pick_up_lng, :drop_off_address, :drop_off_lat, :drop_off_lng, :when, 
                :contact_number, :ticket_id, :estimated_trip_time, :status, :driver_lat, :driver_lng
  
  def initialize(attributes = {})  
    attributes.each do |name, value|  
      send("#{name}=", value) 
    end  
  end

  # -----------------
  # ActiveModel fluff
  # -----------------

  def attributes
    {
      'id'                  => id,
      'pick_up_address'     => pick_up_address,
      'pick_up_lat'         => pick_up_lat,
      'pick_up_lng'         => pick_up_lng,
      'drop_off_address'    => drop_off_address, 
      'drop_off_lat'        => drop_off_lat,
      'drop_off_lng'        => drop_off_lng,
      'when'                => self.when,
      'contact_number'      => contact_number,
      'status'              => status,
      'driver_lat'          => driver_lat,
      'driver_lng'          => driver_lng,
      'ticket_id'           => ticket_id,
      'estimated_trip_time' => estimated_trip_time
    }
  end

  # Needed to make work with action_view's form_for
  def persisted?
    false
  end

  # -----------------
  # Booking Methods
  # -----------------

  # ---
  # Take an options hash. Needs to contain either :id or :ticket_id
  def self.find(opts)
    job = opts.has_key?(:id) ? VW::Job.show(opts[:id]) : VW::Job.show(opts[:ticket_id], true)
    from_job(job)
  end

  def create
    job = to_job
    job = job.create
    self.id = job.id
  end

  def destroy
    job = VW::Job.show(self.id)
    job.delete
  end
  
  private

  def self.from_job(job)
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
      :ticket_id => job.third_party_id,
      :estimated_trip_time => job.planned_duration
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

  def to_job
    VW::Job.new(
      "?? Who ??",
      "Mobile App Booking",
      self.estimated_trip_time || 30.minutes,
      [
        VW::Step.new("Pick Up", VW::Location.new(self.pick_up_address, self.pick_up_lat, self.pick_up_lng)),
        VW::Step.new("Drop Off", VW::Location.new(self.drop_off_address, self.drop_off_lat, self.drop_off_lng))
      ],
      [
        VW::CustomField.new("When", self.when),
        VW::CustomField.new("Contact", self.contact_number),
      ],
      nil,
      self.ticket_id
    )
  end
  
end
