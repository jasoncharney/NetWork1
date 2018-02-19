//2/15
//LOOK AT CLIENT SIDE SOCKET API!!!

var socket;
var myRole;
var clientNumber; //number representing which client they are. Updates when clients disconnect (FIFO)
var myFont;
var fade;
var boom, boomAmp, boomLevel;
var acceptingMaster;
var iAmMaster = false;
var tssAmp, tssLevel;
var tssEnv;
var mode;

var beep, beepEnv, beepLevel;

var beepFund = 200;

var colorLFO = new Array(6);
var colorLFOAmp = new Array(6);

//load all assets that will be used.
function preload(){
    boom = loadSound('assets/boom.mp3');
    tss = loadSound('assets/tss.mp3')
    myFont = loadFont('assets/Gulim.ttf');
}


function setup(){
  createCanvas(window.innerWidth, window.innerHeight);

  //load settings for all modes: perhaps move this to happen upon role selection.

  //boomTss
  boomLoad();
  tssLoad();
  beepLoad();
    var beepRepeat = setInterval(beepPlay,1000);
  //gradients
  c1 = createVector(100,100,100);
  c2 = createVector(127,127,127);
  for (var i = 0; i < colorLFO.length; i++){
    colorLFO[i] = new p5.Oscillator('triangle');
    colorLFOAmp[i] = new p5.Amplitude();
    colorLFO[i].freq(random(0.01,0.05));
    colorLFO[i].amp(random(0.5,1.));
    colorLFO[i].phase(random(0.,1.));
    colorLFO[i].disconnect();
    colorLFO[i].start();
    colorLFOAmp[i].setInput(colorLFO[i]);
}

  socket = io.connect();


    socket.on('acceptingMaster',function(_master){
        acceptingMaster = _master;
    });

    socket.on('iAmMaster',function(_iAmKinged){
        iAmMaster = _iAmKinged;
    });

    socket.on('clientNumber', function(socketID){
        clientNumber = socketID;
        console.log(clientNumber);
    });

    socket.on('mode',function(_mode){
        mode = _mode;
        if (mode == 'welcome'){
            fade = 0;
        }
        if (mode == 'beepPass',function(passTheBeep){
            //beepRepeat;
        });
    });

    socket.on('tssEcho',function(){
        setTimeout(tssEcho,random(200,1000));
    });

  noStroke();


}

//single sound events triggered by server...visualization in draw? With settings passed through from audio events.



function draw(){

    // socket.on('mode',function(_mode){
    //     mode = _mode;
    //     if (mode == 'welcome'){
    //         fade = 0;
    //     }
    // });


   background(0);

if (iAmMaster == true){
    if (mode == 'welcome'){
        chooseMode();
    }
    if (mode == 'boomTss'){
        boomer();
    }
    if (mode == 'gradients'){
        gradientMaster(500);
    }
    if (mode == 'beepPass'){

    }
}
if (iAmMaster == false){
    if (mode == 'welcome'){
        welcomeViz();
    }
    if (mode == 'boomTss'){
        tssViz();
    }
    if (mode == 'gradients'){
        fill(0,255,0);
        gradientMaster(100);
    }
    if (mode == 'beepPass'){
        beepViz();
    }
}

fill(255,0,0);
text(str(clientNumber),width/2,height/2);
    
}

function chooseMode(){
    background(255);
    fill(0);
    textSize(24);
    textAlign(CENTER);
    rectMode(CENTER);
    text('Choose mode:\n1: Boom/Tss\n2:Gradients\n3:beepPass',width/2,100);
    //text('1: Boom/Tss',width/2,100);
    }


function boomer(){
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



function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
}

function mouseClicked(){ 
    if (mode == 'welcome' && iAmMaster == false){
    socket.emit('ready');
    }
}

function gradientMaster(numRects){
    c1.x = abs(colorLFOAmp[0].getLevel())*255;
    c1.y = abs(colorLFOAmp[1].getLevel())*255;
    c1.z = abs(colorLFOAmp[2].getLevel())*255;
    c2.x = abs(colorLFOAmp[3].getLevel())*255;
    c2.y = abs(colorLFOAmp[4].getLevel())*255;
    c2.z = abs(colorLFOAmp[5].getLevel())*255;
    var col1 = color(c1.x,c1.y,c1.z);
    var col2 = color(c2.x,c2.y,c2.z);
    rectMode(CENTER);
    noStroke();
    for (var i = 0; i < numRects; i++){
        var colorInterp = i*(1/numRects);
        fill(lerpColor(col1,col2,colorInterp));
        rect(i*(width/numRects), height/2,(width/numRects)+1,height);
    }
}

function keyPressed(){
    if (mode == 'welcome' && key == '0' && acceptingMaster == true){
    socket.emit('makeMeMaster', 1);
    }
    if (iAmMaster == true){
        if (key === '1'){
            mode = 'boomTss';
        }
        if (key === '2'){
            mode = 'gradients';
        }
        if (key === '3'){
            mode = 'beepPass';
        }
    }
    socket.emit('newMode',mode);
}