FROM ruby:2.1.5

MAINTAINER Shou Ya <shouyatf@gmail.com>

ENV RACK_ENV production

WORKDIR /danmaku

RUN python2.7 -c 'from urllib import urlopen; from json import loads; \
    print(loads(urlopen("http://ip-api.com/json").read().decode("utf-8" \
    ).strip())["countryCode"])' > /tmp/country

ADD Gemfile /danmaku/Gemfile
ADD Gemfile.lock /danmaku/Gemfile.lock

RUN test "$(cat /tmp/country)" = "CN" && { \
    sed -i "s#^source.*\$#source 'https://ruby.taobao.org'#" Gemfile; \
    sed -i "s#remote: .*\$#remote: https://ruby.taobao.org/#" Gemfile.lock; \
    } || true

RUN bundle install

ADD . /danmaku

EXPOSE 4567

CMD ruby app.rb -p 4567 -o 0.0.0.0
