var socket;
var myRole;
var clientNumber; //number representing which client they are. Updates when clients disconnect (FIFO)
var myFont;
var fade;
var boom, boomAmp, boomLevel;
var master;
var tssAmp, tssLevel;
var tssEnv;
var tssParticles = new Array(256);
var tssVelocity = new Array(256);
var mode;

var colorLFO = new Array(6);
var colorLFOAmp = new Array(6);
var gradientLoop;

var drums = new Array(6);
var baseDelayTime = 100;

//load all assets that will be used.

function preload() {
    boom = loadSound('assets/boom.mp3');
    tss = loadSound('assets/tss.mp3')
    myFont = loadFont('assets/Gulim.ttf');
    gradientLoop = loadSound('assets/gradientloop.mp3');
    drumLoad(128);
}


function setup() {
    createCanvas(window.innerWidth, window.innerHeight);

    //load settings for all modes: perhaps move this to happen upon role selection.

    boomLoad();
    tssLoad();
    gradientLoad();

    socket = io('/client');
    //right now client 0 is always "master"
    socket.on('clientNumber', function (socketID) {
        clientNumber = socketID;
        document.title = 'Client Number: ' + clientNumber;
        if (clientNumber == 0) {
            master = true;
        } else {
            master = false;
        }
    });

    socket.on('mode', function (_mode) {
        mode = _mode;
        if (mode == 'gradients') {
            //gradientPlay();
        }
        else{
            //gradientStop();
        }
    });

    socket.on('tssEcho', function (start) {
             setTimeout(tssEcho, random(200, 1000));
    });

    socket.on('shineItUp', function () {
        setTimeout(shineItUp, random(200, 1000));
    });
    socket.on('drumPassStart', function (start) {
        if (start == 1) {
            drumPlay();
        }
    });

    socket.on('drumPass', function (start) {
        if (start == 1) {
            setTimeout(drumPlay, baseDelayTime * drumDelayTimes[int(random(0, drumDelayTimes.length - 1))]);
        }
    });

    socket.on('boomPlay', function(_boom){
        if (master == true){
        boomPlay(_boom);
        }
    });

    socket.on('shineItUp',function(){
        shineItUp();
    });

    noStroke();

} //end of setup

//single sound events triggered by server...visualization in draw? With settings passed through from audio events.

function draw() {

    if (master == true) {

        if (mode == 'boomTss') {
            boomViz();
        }
        if (mode == 'gradients') {
            gradientMaster(500);
        }
        if (mode == 'drumPass') {
            drumViz();
        }
    }
    if (master == false) {

        if (mode == 'boomTss') {
            tssViz();
        }
        if (mode == 'gradients') {
            gradientMaster(100);
        }
        if (mode == 'drumPass') {
            drumViz();
        }
    }
    gradientFilter.freq(map(shineEnvLevel.getLevel(),0.,1.,100,3000));

}



// function welcomeViz() {
//     var fontSize = width * 0.1;
//     fade += 1;
//     background(0);
//     fill(255, fade);
//     textFont(myFont);
//     textSize(fontSize);
//     textAlign(CENTER);
//     text('welcome', width / 2, height / 2);
//     rectMode(CENTER);
//     fill(255, map(abs(sin(radians(frameCount * 2))), 0, QUARTER_PI, 0, 255));
//     textSize(fontSize * 0.25);
//     text('Click to join.', width / 2, height / 2 + (fontSize), textWidth('Click to join.') * 1.75, fontSize);
// }

function windowResized() {
    resizeCanvas(window.innerWidth, window.innerHeight);
}

function keyPressed() {
    if (key === '1' && mode === 'gradients') {
        shineItUp();
    }
}