//2/15
//LOOK AT CLIENT SIDE SOCKET API!!!

var socket;
var myRole;
var myFont;
var fade;
var boom, boomAmp, boomLevel;
var acceptingMaster;
var tssAmp, tssLevel;
var tssEnv;

//load all assets that will be used.
function preload(){
    boom = loadSound('assets/boom.mp3');
    tss = loadSound('assets/tss.mp3')
    myFont = loadFont('assets/Gulim.ttf');
}


function setup(){
  createCanvas(window.innerWidth, window.innerHeight);

  //load settings for all modes: perhaps move this to happen upon role selection.
  boomLoad();
  tssLoad();

  socket = io.connect();

  socket.on('role', function(role, xfade){
        myRole = role;
        fade = xfade;
    });

    socket.on('acceptingMaster',function(_master){
        acceptingMaster = _master;
    })

    socket.on('tssEcho',function(){
        setTimeout(tssEcho,random(200,1000));
    });

  noStroke();
}

//single sound events triggered by server...visualization in draw? With settings passed through from audio events.

function draw(){

  background(0);
  if (myRole == 'master'){
    //I AM THE MASTER COMPUTER!!!!
    masterComputer();
    }

  if (myRole == 'welcome'){
    welcomeViz();
    }

    if (myRole == 'tss'){
    tssViz();
    }

    
}

function masterComputer(){
    background(255);
    boomPlay(frameCount % 500);
    fill(0);
    ellipse(width/2,height/2,boomLevel*500,boomLevel*500);
}

function welcomeViz(){
    var fontSize = width*0.1;
    fade += 1;
    background(0);
    fill(255,fade);
    textFont(myFont);
    textSize(fontSize);
    textAlign(CENTER);
    text('welcome',width/2,height/2);
    rectMode(CENTER);
    fill(255,map(abs(sin(radians(frameCount*2))),0,QUARTER_PI,0,255));
    textSize(fontSize*0.25);
    text('Click to join.',width/2,height/2+(fontSize),textWidth('Click to join.')*1.75,fontSize);
}

function tssViz(){
    //background(0);
    fill(255);
    var tssLevel = tssAmp.getLevel();
    for (var i = 0; i < 1000; i++){
        ellipse(random(width),random(height),tssLevel*100,tssLevel*100);
    }
}

function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
}

function mouseClicked(){ 
    if (myRole == 'welcome'){
    socket.emit('ready', 1);
    }
}

function keyPressed(){
    if (myRole == 'welcome' && key == '0' && acceptingMaster == true){
    socket.emit('makeMeMaster', 1);
    }
}
