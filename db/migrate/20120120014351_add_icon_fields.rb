class AddIconFields < ActiveRecord::Migration
  def change
    add_column :companies, :icon_content_type, :string
    add_column :companies, :icon_data, :binary
  end
end

