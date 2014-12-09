var board = document.getElementById('board');

var build_danmaku = function(text) {
    var dmk = document.createElement('marquee');
    dmk.setAttribute('onfinish', function() {
        this.remove();
    });

    dmk.setAttribute('loop',      '1');
    dmk.setAttribute('direction', 'right');
    // dmk.setAttribute('truespeed', 'right');

    return dmk;
};

oboe('/danmaku.json')
    .node('danmaku', function(danmaku) {
        var node = build_danmaku(danmaku.text);
        board.appendChild(node);
    });
