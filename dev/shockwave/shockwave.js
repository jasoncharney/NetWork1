var numWaves = 100;
var waveArray = new Array();
var impulse = new p5.Oscillator();
var impulseEnv = new p5.Env();
var impulseAnal = new p5.FFT(0.5,256);
var waveShapes = new Array(numWaves);
var shapeIndex;
var propagate = false;
function setup(){
    createCanvas(window.innerWidth,window.innerHeight);
    //wavePopulate();
    impulse.freq(random(120,440));
    impulseEnv.setADSR(0.01,0.1,1.,1);
    impulse.start();
    impulse.amp(impulseEnv);
}
function draw(){
    background(0);
    noStroke();
    fill(255,100);
    //stroke(255);
    for (var i = 0; i < waveArray.length; i++){
            waveArray[i].move();
            waveArray[i].display();
            waveArray[i].remove(i);
    }
}

function windowResized(){
resizeCanvas(window.innerWidth,window.innerHeight);
}

function Wave(posx, posy, velx, vely){
    this.posx = posx;
    this.posy = posy;
    this.velx = velx;
    this.vely = vely;
        this.move = function(){
            this.posx += this.velx;
            this.posy += this.vely;
        }
        this.display = function(){
            push();
            translate(this.posx,this.posy);
            ellipse(0,0,10,10);
            pop();
        }
        this.remove = function(index){
            if (this.posx > width*2|| this.posy > height*2){
                waveArray.splice(index,1); 
            }
        }
}

function keyPressed(){
    wavePropagate();
    //impulseEnv.play();
}

function wavePropagate(){
    for (var i = 0; i < numWaves; i++){
        waveArray.push(new Wave(random(10),random(10),random(100),random(100)));
    }
    
}