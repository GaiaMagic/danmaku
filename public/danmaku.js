var board = document.getElementById('board');
var perf_id = document.location.pathname.split('/').slice(-2,-1)[0];

var build_danmaku = function(text) {
    var dmk = document.createElement('marquee');
    dmk.setAttribute('onfinish', 'this.remove();');

    dmk.setAttribute('loop', '1');

    var scroll_amount = (text.length / 17) * 30;

    dmk.setAttribute('scrollamount', '10');
    dmk.setAttribute('scrolldelay', scroll_amount);
    dmk.setAttribute('truespeed', 'truespeed');
    dmk.setAttribute('direction', 'left');
    dmk.setAttribute('class', 'danmaku');


    var top = (window.innerHeight - 31) * Math.random();

    dmk.style.top = top + 'px';
    dmk.textContent = text;
    // dmk.setAttribute('truespeed', 'right');

    return dmk;
};

var evtSource = new EventSource('stream.json');

document.onreadystatechange = function (){
    var state = document.readyState;
    if (state == 'complete') {
        evtSource.addEventListener('danmaku', function (e) {
            var node = JSON.parse(e.data);
            var dom = build_danmaku(node.text);
            board.appendChild(dom);
            dom.start();
        }, false);
    }
};
