require "sinatra"
require "./app"

set :port, 4567

ActiveRecord::Base.establish_connection(
  adapter: "sqlite3",
  database: "./db/library.db",
)
ActiveRecord::Base.connection.execute("PRAGMA foreign_keys = ON;")

run Sinatra::Application
