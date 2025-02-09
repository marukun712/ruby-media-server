require "sinatra"
require "taglib"
require "fileutils"
require "streamio-ffmpeg"
require "securerandom"
require "./models"
require "httparty"
require "json"
require "uri"

MEDIA_DIR = "./media/music"

post "/upload" do
  unless params[:file]
    halt 400, "Invalid file upload"
  end

  file = params[:file][:tempfile]
  original_filename = params[:file][:filename]
  upload_id = SecureRandom.uuid()

  upload_dir = File.join(MEDIA_DIR, upload_id)
  FileUtils.mkdir_p(upload_dir)

  original_path = File.join(upload_dir, original_filename)
  File.open(original_path, "wb") do |f|
    f.write(file.read)
  end

  metadata = extract_metadata(original_path, upload_id)

  create_or_update_metadata(metadata, upload_id)

  convert_to_hls(original_path, upload_id)

  content_type :json
  { upload_id: upload_id }.to_json
end

get "/library" do
  content_type :json
  Album.includes(:tracks, :artist).all.to_json(include: { tracks: {}, artist: {} })
end

get "/artist/:id" do
  content_type :json
  Artist.includes(:albums).find_by(id: params[:id]).to_json(include: { albums: {} })
end

get "/album/:id" do
  content_type :json
  Album.includes(:tracks, :artist).find_by(id: params[:id]).to_json(include: { tracks: {}, artist: {} })
end

get "/stream/:upload_id/:file_name" do
  content_type "application/x-mpegURL"
  File.read(File.join(MEDIA_DIR, "#{params[:upload_id]}", params[:file_name]))
end

post "/track/delete/:id" do
  content_type :json
  Track.find(params[:id]).destroy
end

post "/artist/delete/:id" do
  content_type :json
  Artist.find(params[:id]).destroy
end

post "/artist/edit/:id" do
  content_type :json
  artist = Artist.find(params[:id])
  artist.update(name: params[:name])
  artist.to_json
end

post "/album/delete/:id" do
  content_type :json
  Album.find(params[:id]).destroy
end

post "/album/edit/:id" do
  content_type :json
  album = Album.find(params[:id])
  album.update(title: params[:title], year: params[:year], cover_url: params[:cover_url], track_count: params[:track_count])
  album.to_json
end

def extract_metadata(file_path, upload_id)
  metadata = {}
  TagLib::FileRef.open(file_path) do |fileref|
    tag = fileref.tag
    properties = fileref.audio_properties

    metadata = {
      title: tag.title || File.basename(file_path, File.extname(file_path)),
      artist: tag.artist || "Unknown Artist",
      album: tag.album || "Unknown Album",
      year: tag.year || nil,
      track: tag.track || nil,
      bitrate: properties.bitrate || nil,
    }
  end

  metadata_path = File.join(MEDIA_DIR, upload_id, "metadata.json")
  File.write(metadata_path, metadata.to_json)

  metadata
rescue => e
  puts "Metadata extraction error: #{e.message}"
  {}
end

def convert_to_hls(file_path, upload_id)
  output_path = File.join(MEDIA_DIR, upload_id, "playlist.m3u8")

  FFMPEG::Movie.new(file_path).transcode(output_path,
                                         audio_codec: "aac",
                                         video_codec: "none",
                                         custom: %w(-f hls -hls_time 10 -hls_list_size 0))
rescue => e
  puts "HLS conversion error: #{e.message}"
end

def create_or_update_metadata(metadata, track_id)
  begin
    ActiveRecord::Base.transaction do
      artist = Artist.find_by(
        name: metadata[:artist],
      )

      if !artist
        artist = Artist.create(id: SecureRandom.uuid(), name: metadata[:artist])
      else
        artist.update(name: metadata[:artist])
      end

      search = MusicBrainzSearch.new
      result = search.search_album(metadata[:album], metadata[:artist]).first

      url = "http://coverartarchive.org/release-group/#{result[:mbid]}/front"

      album = Album.find_by(
        title: metadata[:album],
      )

      if !album
        album = Album.create(
          id: SecureRandom.uuid(),
          title: metadata[:album],
          year: metadata[:year],
          track_count: metadata[:track],
          artist: artist,
          cover_url: url,
        )
      else
        album.update(
          title: metadata[:album],
          year: metadata[:year],
          track_count: metadata[:track],
          artist: artist,
          cover_url: url,
        )
      end

      Track.create(
        id: track_id,
        title: metadata[:title],
        bitrate: metadata[:bitrate],
        album: album,
        artist: artist,
      )
    end
  end
rescue ActiveRecord::RecordInvalid => e
  puts "Database save error: #{e.message}"
end

class MusicBrainzSearch
  include HTTParty
  base_uri 'https://musicbrainz.org/ws/2'
  
  def initialize
    @headers = {
      'User-Agent' => 'MyMusicApp/1.0.0 (mail@maril.blue)',
      'Accept' => 'application/json'
    }
  end

  def search_album(album_name, artist_name = nil)
    query_parts = ["release-group:#{album_name}"]
    query_parts << "artist:#{artist_name}" if artist_name
    
    query = URI.encode_www_form_component(query_parts.join(' AND '))
    
    response = self.class.get(
      "/release-group/?query=#{query}&fmt=json",
      headers: @headers
    )
    
    return [] unless response.success?
    
    release_groups = response['release-groups']
    release_groups.map do |group|
      {
        title: group['title'],
        mbid: group['id'], 
        artist: group['artist-credit']&.first&.dig('name'),
        type: group['primary-type']
      }
    end
  end
end