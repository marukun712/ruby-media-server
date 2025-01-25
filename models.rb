require "sinatra/activerecord"

class Album < ActiveRecord::Base
  belongs_to :artist
  has_many :tracks
end

class Artist < ActiveRecord::Base
  has_many :albums
  has_many :tracks
end

class Track < ActiveRecord::Base
  belongs_to :album
  belongs_to :artist
end
