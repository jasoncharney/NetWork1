var u;
var a;
var bladeLength;
var grass;
// var count;
var grassAttPos;
var grassAttVel;

function grassyLoad(){
    bladeLength = width*0.04;
    u = width/bladeLength;
    var highCount = height/bladeLength;
    var wideCount = u;
    grass = new Array(int(highCount * wideCount));

    grassAttPos = createVector(width/2,height/2);
    grassAttVel = createVector(10,10);

    var grassLoadIndex = 0;
    for (var xc = 0; xc < wideCount; xc++) {
        for (var yc = 0; yc < highCount; yc++) {
            grass[grassLoadIndex] = new Grassblade(int(xc)*bladeLength,int(yc)*bladeLength);
            grassLoadIndex++;
        }
    }
}

function grassMove(){
    background(54,204,124);
    stroke(214,255,190);  
    strokeWeight(10);
    translate(20, 20);
    for (var i = 0; i < grass.length; i++) {
      grass[i].position();
      grass[i].update();
    }
}

function Grassblade(_x, _y) {
    this.x = _x;
    this.y = _y;
    this.a = 0;
    
    this.position = function(){
      this.a = atan2(grassAttPos.y-this.y, grassAttPos.x-this.x);
    }
    this.update = function() {
      push();
      translate(this.x, this.y);
      rotate(this.a);
      line(-bladeLength*0.5,0,bladeLength*0.5,0);
      pop();
    }
  }

  function grassAttractor(){
    grassAttPos.x += grassAttVel.x;
    grassAttPos.y += grassAttVel.y;
    if (grassAttPos.x > width || grassAttPos.x < 0){
      grassAttVel.x = -grassAttVel.x;
    }
    if (grassAttPos.y > height || grassAttPos.y < 0){
      grassAttVel.y = -grassAttVel.y;
    }
  }