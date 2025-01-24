require "sinatra"
require "taglib"
require "fileutils"
require "streamio-ffmpeg"
require "securerandom"

UPLOAD_DIR = File.join(File.dirname(__FILE__), "uploads")
STREAM_DIR = File.join(File.dirname(__FILE__), "public", "streams")

FileUtils.mkdir_p(UPLOAD_DIR)
FileUtils.mkdir_p(STREAM_DIR)

post "/upload" do
  halt 400, "No file uploaded" unless params[:file]

  file = params[:file][:tempfile]
  original_filename = params[:file][:filename]

  upload_id = SecureRandom.uuid

  original_path = File.join(UPLOAD_DIR, "#{upload_id}_#{original_filename}")
  File.open(original_path, "wb") do |f|
    f.write(file.read)
  end

  metadata = extract_metadata(original_path)

  stream_path = convert_to_hls(original_path, upload_id)

  content_type :json
  {
    upload_id: upload_id,
    metadata: metadata,
    stream_path: stream_path,
  }.to_json
end

get "/metadata/:upload_id" do
  upload_id = params[:upload_id]
  metadata_file = File.join(UPLOAD_DIR, "#{upload_id}_metadata.json")

  halt 404, "Metadata not found" unless File.exist?(metadata_file)

  content_type :json
  File.read(metadata_file)
end

get "/stream/:upload_id/playlist.m3u8" do
  content_type "application/x-mpegURL"
  File.read(File.join(STREAM_DIR, "#{params[:upload_id]}", "playlist.m3u8"))
end

private

def extract_metadata(file_path)
  metadata = {}

  TagLib::FileRef.open(file_path) do |fileref|
    tag = fileref.tag
    properties = fileref.audio_properties

    metadata = {
      title: tag.title || File.basename(file_path),
      artist: tag.artist || "Unknown Artist",
      album: tag.album || "Unknown Album",
      year: tag.year,
      track: tag.track,
      duration: properties.length,
      bitrate: properties.bitrate,
    }
  end

  metadata_path = File.join(UPLOAD_DIR, "#{File.basename(file_path, ".*")}_metadata.json")
  File.write(metadata_path, metadata.to_json)

  metadata
rescue => e
  puts "Metadata extraction error: #{e.message}"
  {}
end

def convert_to_hls(file_path, upload_id)
  stream_upload_dir = File.join(STREAM_DIR, upload_id)
  FileUtils.mkdir_p(stream_upload_dir)

  output_path = File.join(stream_upload_dir, "playlist.m3u8")

  FFMPEG::Movie.new(file_path).transcode(output_path,
                                         audio_codec: "aac",
                                         video_codec: "none",
                                         custom: %w(-f hls -hls_time 10 -hls_list_size 0))

  "/streams/#{upload_id}"
rescue => e
  puts "HLS conversion error: #{e.message}"
  nil
end
