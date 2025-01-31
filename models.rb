require "sinatra/activerecord"

class Album < ActiveRecord::Base
  belongs_to :artist
  has_many :tracks, dependent: :destroy
end

class Artist < ActiveRecord::Base
  has_many :albums, dependent: :destroy
  has_many :tracks, dependent: :destroy
end

class Track < ActiveRecord::Base
  belongs_to :album
  belongs_to :artist
end
