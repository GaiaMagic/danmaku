require 'sinatra'
require 'sinatra/sse'
require 'json'
require 'rest-client'
require 'time'

require 'sinatra/reloader' if development?

REQUEST_HOST = 'https://meiyanchu.com'
# REQUEST_HOST = 'http://127.0.0.1:3000'

FETCH_INTERVAL = 1.0

include Sinatra::SSE

helpers do
  def comment_for(perf_id)
    @comment[perf_id]
  end

  def register_comment(perf_id)
    @config ||= {}
    @comment ||= {}
    return unless @config[perf_id].nil?

    @comment[perf_id] = []
    @config[perf_id] = {
      last_update: Time.now
    }
    EventMachine.add_periodic_timer(FETCH_INTERVAL) do
      fetch_comments(perf_id)
    end
  end

  def fetch_comments(perf_id)
    request_path = "/api/performances/#{perf_id}/comments"
    request_uri = "#{REQUEST_HOST}#{request_path}"
    params = {
      without_photos: true
    }
    params[:since] = @config[perf_id][:last_update].iso8601

    resp = RestClient.get(request_uri,
                          params: params)

    result = JSON.parse(resp)

    if result.empty?
      []
    else
      @config[perf_id][:last_update] = Time.now
      @comment[perf_id].concat(result.reverse)
    end
  end
end


get '/performances/:id/danmaku' do
  redirect "#{request.url}/"
end

get '/performances/:id/danmaku/' do
  send_file "public/danmaku.html", type: :html
end

get '/performances/:id/danmaku/stream.json' do
  perf_id = params[:id].to_i
  register_comment(perf_id)

  sse_stream do |out|
    loop do
      sleep FETCH_INTERVAL and next if comment_for(perf_id).empty?

      cmt = comment_for(perf_id).pop
      sleep 0.1

      puts cmt['content']
      json = {
        text: cmt['content']
      }
      out.push event: 'danmaku', data: JSON.dump(json)
    end
  end

end


get '/performances/:id/danmaku/*' do
  send_file "public/#{params[:splat].last}"
end
