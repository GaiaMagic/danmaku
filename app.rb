require 'sinatra'
require 'json'
require 'rest-client'
require 'time'

require 'sinatra/reloader' if development?

REQUEST_HOST = 'https://meiyanchu.com'
# REQUEST_HOST = 'http://127.0.0.1:3000'
PERFORMANCE_ID = 5547
# PERFORMANCE_ID = 1

REQUEST_PATH = "/api/performances/#{PERFORMANCE_ID}/comments"

helpers do
  def fetch_comments
    request_uri = "#{REQUEST_HOST}#{REQUEST_PATH}"
    params = {
      without_photos: true
    }

    params[:since] = @last_fetch.iso8601 if @last_fetch

    puts params

    resp = RestClient.get(request_uri,
                          params: params)
    result = JSON.parse(resp)
    if result.empty?
      []
    else
      @last_fetch = Time.now
      result.reverse
    end
  end
end

get '/' do
  send_file 'public/danmaku.html', type: :html
end

get '/danmaku.json' do
  content_type :json

  stream do |out|
    loop do
      fetch_comments.each do |cmt|
        puts cmt['content']
        json = {
          danmaku: {
            text: cmt['content']
          }
        }
        out << JSON.dump(json)
        sleep 0.1
      end
      sleep 1
    end
  end
end
