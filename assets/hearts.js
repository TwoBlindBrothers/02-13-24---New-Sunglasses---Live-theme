var snowWrapper = document.getElementById('snow')
const logo = document.getElementById('logo-desktop')
snowWrapper.style.display = 'block'
var brd = document.createElement("DIV");
// document.body.insertBefore(brd, document.getElementById("board"));
snowWrapper.appendChild(brd)

const duration = 3000;
const speed = 0.05;
const cursorXOffset = 0;
const cursorYOffset = -5;

var hearts = [];

function generateHeart(x, y, xBound, xStart, scale)
{
    var heart = document.createElement("DIV");
    heart.setAttribute('class', 'heart');
    brd.appendChild(heart);
    heart.time = duration;
    heart.x = x;
    heart.y = y;
    heart.bound = xBound;
    heart.direction = xStart;
    heart.style.left = heart.x + "%";
    heart.style.top = heart.y + "%";
    heart.scale = scale;
    heart.style.transform = "scale(" + scale + "," + scale + ")";
    if(hearts == null)
        hearts = [];
    hearts.push(heart);
    return heart;
}

var down = false;

logo.onmouseenter = function(e) {
    down = true;
}

logo.onmouseleave = function(e) {
    down = false;
}

var before = Date.now();
var id = setInterval(frame, 5);
var gr = setInterval(check, 50);

function frame()
{
    var current = Date.now();
    var deltaTime = current - before;
    before = current;
    for(i in hearts)
    {
        var heart = hearts[i];
        heart.time -= deltaTime;
        if(heart.time > 0)
        {
            heart.y -= speed;
            heart.style.top = heart.y + "%";
            heart.style.left = heart.x + heart.direction * heart.bound * Math.sin(heart.y * heart.scale / 30) / heart.y * 200 + "%";
        }
        else
        {
            heart.parentNode.removeChild(heart);
            hearts.splice(i, 1);
        }
    }
}

function check()
{
    if(down)
    {
        var start = 1 - Math.round(Math.random()) * 2;
        var scale = Math.random() * Math.random() * 0.8 + 0.2;
        var bound = 0 + Math.random() * 10;
        var x = 0 + Math.random() * 100
        var y = 100
        generateHeart(x, y, bound, start, scale);
    }
}