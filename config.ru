require "sinatra"
require "./app"
require 'rack/cors'

#CORS設定
use Rack::Cors do
  allow do
    origins '*'
    resource '*',
      headers: :any,
      methods: [:get, :post, :put, :delete, :options]
  end
end

set :port, 4567

ActiveRecord::Base.establish_connection(
  adapter: "sqlite3",
  database: "./db/library.db",
)
ActiveRecord::Base.connection.execute("PRAGMA foreign_keys = ON;")

run Sinatra::Application
