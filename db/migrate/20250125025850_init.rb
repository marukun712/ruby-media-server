class Init < ActiveRecord::Migration[7.1]
  def change
    create_table :music, id: :uuid do |t|
      t.text :title, null: false
      t.integer :bitrate
      t.references :album, null: false, foreign_key: true
      t.references :artist, null: false, foreign_key: true
    end

    create_table :album, id: :uuid do |t|
      t.text :title, null: false
      t.integer :year
      t.integer :track_count
    end

    create_table :artist, id: :uuid do |t|
      t.text :name, null: false
    end
  end
end
