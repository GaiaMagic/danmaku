require 'sinatra'
require 'sinatra/contrib'
require 'json'

require 'sinatra/reloader' if development?

get '/' do
  send_file 'public/danmaku.html', type: :html
end

get '/danmaku.json' do
  stream do |out|
    out << '['
    out << JSON.dump({text: 'meow~'})
    out << ','
    sleep 1
    out << JSON.dump({text: 'meow~'})
    out << ','
    sleep 0.5
    out << JSON.dump({text: 'meow~'})
    out << ']'
  end
end
