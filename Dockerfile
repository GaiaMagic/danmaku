FROM ruby:2.1.5

MAINTAINER Cai Guanhao (caiguanhao@gmail.com)

ADD Gemfile /danmaku/Gemfile
ADD Gemfile.lock /danmaku/Gemfile.lock

ENV RACK_ENV production

WORKDIR /danmaku

RUN bundle install

EXPOSE 4567

CMD ruby app.rb -p 4567

ADD . /danmaku
