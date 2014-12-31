danmaku
=======

manual
------

Simply run `fig up -d` to start this application.

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
