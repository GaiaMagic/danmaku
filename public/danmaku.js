var board = document.getElementById('board');

var speed = 2.5 * 1000;
var scroll_amount = 10;
var danmaku_lines = 10;

var build_danmaku = function(text) {
    var dmk = document.createElement('marquee');
    var box = document.createElement('div');

    box.setAttribute('class', 'danmaku');
    box.style.fontSize = font_height + 'px';
    box.style.position = 'fixed';
    box.style.top = box.style.top = '0';
    box.style.zIndex = '-999';
    board.appendChild(box);

    var text_height = box.offsetHeight;
    var text_width = box.offsetWidth;

    box.remove();

    var screen_width  = window.innerWidth;
    var screen_height = window.innerHeight;
    var font_height = screen_height / danmaku_lines;
    var top = (screen_height - text_height - 1) * Math.random();
    var scroll_delay = speed / (screen_width + text_width) * scroll_amount;

    dmk.setAttribute('truespeed', 'truespeed');
    dmk.setAttribute('direction', 'left');
    dmk.setAttribute('class', 'danmaku');
    dmk.setAttribute('loop', '1');
    dmk.textContent = text;

    dmk.setAttribute('onfinish', 'this.remove();');

    dmk.style.fontSize = font_height + 'px';

    dmk.style.top = top + 'px';

    dmk.setAttribute('scrollamount', scroll_amount);
    dmk.setAttribute('scrolldelay', scroll_delay);

    board.appendChild(dmk);
    dmk.start();


    return dmk;
};

var evtSource = new EventSource('stream.json');

document.onreadystatechange = function (){
    var state = document.readyState;
    if (state == 'complete') {
        evtSource.addEventListener('danmaku', function (e) {
            var node = JSON.parse(e.data);
            build_danmaku(node.text);
        }, false);
    }
};
