require "activerecord"

class Album < ApplicationRecord
  belongs_to :artist
  has_many :music
end

class Artist < ApplicationRecord
  has_many :albums
  has_many :music
end

class Music < ApplicationRecord
  belongs_to :album
  belongs_to :artist
end
