require 'sinatra'
require 'json'

require 'sinatra/reloader' if development?

get '/' do
  send_file 'public/danmaku.html', type: :html
end

get '/danmaku.json' do
  content_type :json

  stream do |out|
    loop do
      text = 'a' * (rand * 10).to_i

      out << JSON.dump({danmaku: {text: "meow~ #{text}"}})
      sleep (rand * 3)
    end
  end
end
