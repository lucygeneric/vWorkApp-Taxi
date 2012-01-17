class AddLogoFields < ActiveRecord::Migration
  def change
    add_column :companies, :logo_content_type, :string
    add_column :companies, :logo_data, :binary
  end
end
