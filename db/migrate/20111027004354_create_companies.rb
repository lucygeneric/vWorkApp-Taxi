class CreateCompanies < ActiveRecord::Migration
  def change
    create_table :companies do |t|
      t.string :name
      t.string :phone
      t.string :api_key
      t.string :subdomain

      t.timestamps
    end
  end
end
