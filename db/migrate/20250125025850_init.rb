class Init < ActiveRecord::Migration[7.1]
  def change
    create_table :artists, id: :uuid do |t|
      t.text :name, null: false
    end

    create_table :albums, id: :uuid do |t|
      t.text :title, null: false
      t.integer :year
      t.integer :track_count
      t.text :cover_url
      t.references :artist, null: false, foreign_key: true, type: :uuid
    end

    create_table :tracks, id: :uuid do |t|
      t.text :title, null: false
      t.integer :bitrate
      t.references :album, null: false, foreign_key: true, type: :uuid
      t.references :artist, null: false, foreign_key: true, type: :uuid
    end
    add_index :artists, [:name], unique: true
    add_index :albums, [:title], unique: true
  end
end
