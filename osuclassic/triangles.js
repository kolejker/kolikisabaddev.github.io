var triangleLimit = 300;
var transition = 3000; //milliseconds
var playIntro = true;
var playOutro = false;
var fps = 60;

var stage = new createjs.Stage("triangles");
var triangles = [];
stage.update();
createjs.Ticker.setFPS(fps);

function createTriangle() {
  for (var i = 0; i < triangleLimit; i++) {
    triangles[i] = new createjs.Shape();
    triangles[i].__x = Math.random();
    triangles[i].__y = Math.random();
    triangles[i].b = p = -Math.floor((Math.random() * 80) - 255);
    triangles[i].d = Math.random() * 60 + 5;
    triangles[i].d2 = Math.random() * 60 + 5;
    triangles[i].radius = Math.random() * 60 * (triangles[i].d / 25);
    var blurFilter = new createjs.BlurFilter(5, 5, 1);
    triangles[i].filters = [blurFilter];
    var _r = 80 * (triangles[i].d / 25);
    triangles[i].graphics.beginFill("rgb(" + p + "," + p + "," + p + ")").drawPolyStar(0, 0, _r, 3, 0, -90);
    //.drawCircle(0, 0, 60 * (triangles[i].d / 25));
    stage.addChild(triangles[i]);
  }
}

var frame = 0;
var mouse = 12,
  _muse = 0,
  triMoveTime = 60;

function handleTick() {
  var i;
  if (playIntro) {
    var time = transition * (60 / 1000);
    var corner = 90 * (Math.PI / 180.0);
    var completed = frame / time;
    var height = (window.innerHeight * (1 - (Math.easeOutQuart(frame, 0, 1, time))));
    for (i = 0; i < triangleLimit; i++) {
      triangles[i]._y = triangles[i].__y * window.innerHeight;
      triangles[i].x = triangles[i].__x * window.innerWidth;
    }
    if (frame <= time) {
      for (i = 0; i < triangleLimit; i++) {
        if (triangles[i].y <= -200) {
          triangles[i].__x = Math.random();
          triangles[i].x = triangles[i].__x * window.innerWidth;
          var h = height + triangles[i]._y - (frame * 1 * (1 - (1 * (triangles[i].d / 65))));
          triangles[i].y = h + ((1 - (Math.easeInOutQuart(_muse, 0, 1, mouse))) * mouse);
        } else {
          triangles[i].y = height + triangles[i]._y - (frame * 1 * (1 - (1 * (triangles[i].d / 65))));
        }
      }
      //console.log(completed)
      frame++;
    } else {
      stage.dispatchEvent(new createjs.Event('triangleTransitionComplete'));
      playIntro = false;
    }
  } else if (playOutro) {
    var time = transition * (60 / 1000);
    var corner = 90 * (Math.PI / 180.0);
    var completed = frame / time;
    var height = ((window.innerHeight+200) * ((Math.easeOutQuart(frame, 0, 1, time))));
    for (i = 0; i < triangleLimit; i++) {
      triangles[i].tempY = triangles[i].y;
      triangles[i]._y = triangles[i].__y * window.innerHeight;
      triangles[i].x = triangles[i].__x * window.innerWidth;
    }
    if (frame <= time) {
      for (i = 0; i < triangleLimit; i++) {
        //triangles[i].__x = Math.random();
        triangles[i].x = triangles[i].__x * window.innerWidth;
        var h = (frame * 1 * (1 - (1 * (triangles[i].d / 65))));
        
        triangles[i].y = triangles[i].tempY - (height*h);
        //console.log(triangles[i].y);
        //triangles[i].y = triangles[i]._y - (frame * 1 * (1 - (1 * (triangles[i].d / 65))));
        //triangles[i].y = h + ((1 - (Math.easeInOutQuart(_muse, 0, 1, mouse))) * mouse);
      }
      //console.log(completed)
      frame++;
    } else {
      stage.dispatchEvent(new createjs.Event('triangleTransitionComplete'));
      playOutro = false;
    }
  } else {
    for (i = 0; i < triangleLimit; i++) {
      triangles[i].y -= 1 * (1 - (triangles[i].d / 65)) + ((1 - (Math.easeOutQuart(_muse, 0, 1, triMoveTime))) * mouse * (1 - (triangles[i].d / 65)));
      if (triangles[i].y <= -200) {
        triangles[i].__x = Math.random();
        triangles[i].x = triangles[i].__x * window.innerWidth;
        triangles[i].y = window.innerHeight + 200;
      }
    }
  }
  if (_muse < triMoveTime) {
    _muse++;
  }
  stage.update();
}

function onResize() {
  var w = window.innerWidth;
  var h = window.innerHeight;
  stage.canvas.width = w;
  stage.canvas.height = h;
  for (i = 0; i < triangleLimit; i++) {
    triangles[i]._y = triangles[i].__y * window.innerHeight;
    triangles[i].x = triangles[i].__x * window.innerWidth;
  }
  stage.update()
}
window.onresize = function() {
  onResize();
}
Math.easeOutQuart = function(t, b, c, d) {
  t /= d;
  t--;
  return -c * (t * t * t * t - 1) + b;
};

Math.easeInOutQuart = function(t, b, c, d) {
  t /= d;
  return -c * t * (t - 2) + b;
};

function click() {
  _muse = 0;
}

function playOutroNow() {
  frame = 0;
  playOutro = true;
}
createTriangle();
onResize();
//initTriangle();
stage.addEventListener("triangleTransitionComplete", function(e) {
  console.log(e);
})

stage.addEventListener("stagemouseup", function(e) {
  //console.log(e);
})
stage.addEventListener("stagemousedown", function(e) {
  //playOutroNow();
  click();
})
createjs.Ticker.addEventListener("tick", handleTick);