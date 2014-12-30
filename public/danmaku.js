var board = document.getElementById('board');

var speed         = 2.5 * 1000;
var scroll_delay  = 30;
var danmaku_lines = 15;

var calculate_text_width = function(text, font_height) {
    var test = document.createElement('div');

    test.style.fontSize   = font_height + 'px';
    test.style.lineHeight = font_height + 'px';
    test.style.position   = 'absolute';
    test.style.height     = 'auto';
    test.style.width      = 'auto';
    test.style.visibility = 'hidden';
    test.style.whiteSpace = 'nowrap';
    test.textContent      = text;

    board.appendChild(test);

    var width  = test.clientWidth  + 1;
    var height = test.clientHeight + 1;

    test.remove();

    return new Object({
        width:  width,
        height: height
    });
};

var build_danmaku = function(text) {
    var screen_width  = window.innerWidth;
    var screen_height = window.innerHeight;
    var dmk           = document.createElement('div');
    var font_height   = screen_height / danmaku_lines;
    var font_size     = calculate_text_width(text, font_height);

    dmk.style.fontSize   = font_height + 'px';
    dmk.style.lineHeight = font_height + 'px';
    dmk.textContent      = text;
    dmk.setAttribute('class', 'danmaku');

    board.appendChild(dmk);

    var top = (screen_height - font_size.height - 1) * Math.random();
    var scroll_amount = (screen_width + font_size.width) / speed * scroll_delay;

    dmk.style.top = top + 'px';

    dmk.setAttribute('scrollamount' , scroll_amount);
    dmk.setAttribute('direction'    , 'left');
    dmk.setAttribute('left'         , screen_width);
    dmk.setAttribute('remove_at'    , 0 - screen_width - font_size.width);
    dmk.style.left = screen_width + 'px';

    dmk.style.visibility = 'visible';

    return dmk;
};

var setup_timer = function (){
    window.setInterval(function() {
        var dead_danmaku = [];
        for (var i = 0; i < board.children.length; ++i) {
            var dmk = board.children[i];
            var new_left = dmk.getAttribute('left') -
                    dmk.getAttribute('scrollamount');
            dmk.setAttribute('left', new_left);
            dmk.style.left = new_left + 'px';

            if (new_left < dmk.getAttribute('remove_at')) {
                dead_danmaku.push(dmk);
            }
        }

        while (dead_danmaku.length > 0) {
            dead_danmaku.pop().remove();
        }
    }, scroll_delay);
};

var evtSource = new EventSource('stream.json');

document.onreadystatechange = function (){
    var state = document.readyState;
    if (state == 'complete') {
        evtSource.addEventListener('danmaku', function (e) {
            var node = JSON.parse(e.data);
            build_danmaku(node.text);
        }, false);
        setup_timer();
    }
};
