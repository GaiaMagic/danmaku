var board = document.getElementById('board');

var calculate_text_width = function(text) {
    var test = document.createElement('div');

    test.setAttribute('class', 'danmaku');
    test.style.visibility = 'hidden';
    test.textContent      = text;

    board.appendChild(test);

    var width  = test.clientWidth  + 1;
    var height = test.clientHeight + 1;

    test.remove();

    return {
        width:  width,
        height: height
    };
};

var ROWS = [];

var build_danmaku = function(text) {
    var screen_height = window.innerHeight;
    var dmk           = document.createElement('div');
    var font_size     = calculate_text_width(text);

    dmk.textContent = text;
    dmk.setAttribute('class', 'danmaku');

    board.appendChild(dmk);

    var heightPerRow = font_size.height;
    var maxRows = Math.floor(screen_height / heightPerRow);

    var row;
    for (var i = 0; i < maxRows; i++) {
        if (!ROWS[i] || ROWS[i].length === 0) {
            row = i;
            break;
        }
    }

    if (typeof row === 'undefined') {
        row = Math.floor(maxRows * Math.random());
    }

    var top = row * heightPerRow;

    var delay = 0;
    if (ROWS[row] && ROWS[row].length > 0) {
        delay = +ROWS[row][ROWS[row].length - 1].getAttribute('death') - +new Date();
        console.log(delay, 'delayed', ROWS[row][ROWS[row].length - 1].getAttribute('death'), +ROWS[row][ROWS[row].length - 1].getAttribute('death'))
    }

    ROWS[row] = ROWS[row] || [];
    ROWS[row].push(dmk);

    dmk.style.top = top + 'px';
    dmk.style.right = '-' + font_size.width + 'px';

    dmk.style.transitionDelay = delay + 'ms';
    dmk.style.transitionDuration = '10s';

    setTimeout(function () {
        dmk.setAttribute('class', 'danmaku playing');
        dmk.setAttribute('birth', +new Date() + delay);
        dmk.setAttribute('death', +new Date() + delay + 12000);
    }, 0);

    var CUR = ROWS[row];
    setTimeout(function () {
        CUR.splice(CUR.indexOf(dmk), 1);
        dmk.parentNode.removeChild(dmk);
    }, 12000 + delay);
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
