var u;
var l;
var a;
var mods = [];
var x;
var y;
var count;
var attPos;
var attVel;

function setup() {
  createCanvas(windowWidth, windowHeight);
  l = 100;
  u = width/l;
  var highCount = height/l;
  var wideCount = width/u;
  count = int(highCount * wideCount);

  attPos = createVector(width/2,height/2);
  attVel = createVector(10,10);

  var index = 0;
  for (var xc = 0; xc < wideCount; xc++) {
    for (var yc = 0; yc < highCount; yc++) {
      mods[index] = new Module(int(xc)*l,int(yc)*l);
      index++;
    }
   }
}

function draw() {
  background(54,204,124);
  stroke(214,255,190);  
  strokeWeight(10);
  translate(20, 20);
  for (var i = 0; i <= count; i++) {
    mods[i].position();
    mods[i].update();
  }
  attractor();
}

function Module(_x, _y) {
  this.x = _x;
  this.y = _y;
  this.a = 0;
  this.position = function(){
    this.a = atan2(attPos.y-this.y, attPos.x-this.x);
  }
  this.update = function() {
    push();
    translate(this.x, this.y);
    rotate(this.a);
    line(-l*0.5,0,l*0.5,0);
    pop();
  }
}

// Module.prototype.update = function() {
//     this.a = atan2(attPos.y-this.y, attPos.x-this.x);
// }

function attractor(){
  attPos.x += attVel.x;
  attPos.y += attVel.y;
  if (attPos.x > width || attPos.x < 0){
    attVel.x = -attVel.x;
  }
  if (attPos.y > height || attPos.y < 0){
    attVel.y = -attVel.y;
  }
}
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}