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

//load all assets that will be used.

function preload() {
    boom = loadSound('assets/boom.mp3');
    tss = loadSound('assets/tss.mp3');
    myFont = loadFont('assets/Gulim.ttf');
    gradientLoop = loadSound('assets/gradientloop.mp3'); 
    drumLoad(128);
}


function setup() {
    createCanvas(window.innerWidth, window.innerHeight);

    //load settings for all modes: perhaps move this to happen upon role selection.

    boomLoad();
    tssLoad();
    //gradientLoad();
    textLoad();
    grassyLoad();

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
        clearTimeout(drumPlay);
        if (mode == 'gradients') {
            gradientPlay();
        }
        else{
            gradientStop();
        }
    });

    socket.on('tssEcho', function (start) {
             setTimeout(tssEcho, random(200, 1000));
    });

    socket.on('shineItUp', function () {
        setTimeout(shineItUp, random(200, 1000));
    });
    
    socket.on('drumPass', function() {
        drumPlay(clientNumber);
    });

    socket.on('boomPlay', function(_boom){
        if (master == true){
        boomPlay(_boom);
        }
    });

    socket.on('shineItUp',function(){
        shineItUp();
    });
    socket.on('createShockwave',function(){
        if (master == true){
        wavePopulate();
        }
    });
    socket.on('addWave',function(_waveDirection,_posx,_posy,_velx,_vely){
        if (master == false){
            addWave(_waveDirection,_posx,_posy,_velx,_vely);
        }
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
        if (mode == 'shockWave'){
            background(0);
            wavePropagate();
        }
        if (mode == 'textFlicker'){
            //fill(255);
            if (frameCount % 5 == 0){
            textLoad();
            }
            textFlick();
        }
        if (mode == 'grassy'){
            grassAttractor();
            grassMove();
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
        if (mode == 'shockWave'){
            background(0);
            wavePropagate();
        }
        if (mode == 'grassy'){
            grassAttractor();
            grassMove();
        }
    }

}

function windowResized() {
    resizeCanvas(window.innerWidth, window.innerHeight);
    grassyLoad();
}

function keyPressed() {
    if (key === '1' && mode === 'gradients') {
        shineItUp();
    }
}