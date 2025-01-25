FROM ruby:2.7.7

WORKDIR /app

COPY Gemfile Gemfile.lock* ./

RUN apt-get update && apt-get install libtag1-dev ffmpeg -y

RUN bundle install

COPY . .

EXPOSE 4567

CMD ["bundle", "exec", "rackup", "--host", "0.0.0.0", "--port", "4567"]