require "sinatra"
require "taglib"
require "fileutils"
require "streamio-ffmpeg"
require "securerandom"
require "./models"

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

  convert_to_hls(original_path, upload_id)

  content_type :json
  { upload_id: upload_id }.to_json
end

def extract_metadata(file_path, upload_id)
  metadata = {}
  TagLib::FileRef.open(file_path) do |fileref|
    tag = fileref.tag
    properties = fileref.audio_properties

    metadata = {
      title: tag.title,
      artist: tag.artist,
      album: tag.album,
      year: tag.year,
      track: tag.track,
      bitrate: properties.bitrate,
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
