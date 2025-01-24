class Init < ActiveRecord::Migration[8.0]
  def change
    create_table :music do |t|
      t.text :id
    end
  end
end
