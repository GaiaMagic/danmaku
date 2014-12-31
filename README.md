danmaku
=======

manual
------

Simply run `fig up -d` to start this application.

If you have changed the code and want to rebuild the app, run
`fig build && fig kill && fig up -d`.

To install `fig`, follow <http://www.fig.sh/>.

nginx configuration
-------------------

```
location ~* ^/show/(\d+)/danmu {
	proxy_pass http://<IP>:10240;
	proxy_buffering off;
	proxy_cache off;
	proxy_set_header Connection '';
	proxy_http_version 1.1;
	chunked_transfer_encoding off;
}
```

manually adding a comment
-------------------------

```
curl https://youyanchu.com/api/performances/<SHOW_ID>/comments \
-X POST -d '{"content": "hahaha", "is_anonymous": "true"}' \
-H 'content-type: application/json' \
-H 'x-user-access-token: <YOUR_ACCESS_TOKEN>'
```
