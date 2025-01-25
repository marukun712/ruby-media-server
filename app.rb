require "sinatra"
require "taglib"
require "fileutils"
require "streamio-ffmpeg"
require "securerandom"
require "./models"

MEDIA_DIR = "./media/music"

before do
  response.headers["Access-Control-Allow-Origin"] = "*"
end

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
  Track.includes(:artist, :album).all.to_json(include: { artist: {}, album: {} })
end

get "/artists" do
  content_type :json
  Artist.includes(:tracks).all.to_json(include: { tracks: {} })
end

get "/albums" do
  content_type :json
  Album.includes(:tracks).all.to_json(include: { tracks: {} })
end

get "/stream/:upload_id/:file_name" do
  content_type "application/x-mpegURL"
  File.read(File.join(MEDIA_DIR, "#{params[:upload_id]}", params[:file_name]))
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
      artist = Artist.where(
        name: metadata[:artist],
      ).first

      if !artist
        artist = Artist.create(id: SecureRandom.uuid(), name: metadata[:artist])
      end

      album = Album.where(
        title: metadata[:album],
      ).first

      if !album
        album = Album.create(
          id: SecureRandom.uuid(),
          title: metadata[:album],
          year: metadata[:year],
          track_count: metadata[:track],
          artist: artist,
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
