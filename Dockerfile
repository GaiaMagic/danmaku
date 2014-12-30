FROM ruby:2.1.5

MAINTAINER Shou Ya <shouyatf@gmail.com>

ADD Gemfile /danmaku/Gemfile
ADD Gemfile.lock /danmaku/Gemfile.lock

ENV RACK_ENV production

WORKDIR /danmaku

RUN bundle install

EXPOSE 4567

ADD . /danmaku

CMD ruby app.rb -p 4567 -o 0.0.0.0
