//2/15
//LOOK AT CLIENT SIDE SOCKET API!!!

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

var drums = new Array(6);
var baseDelayTime = 100;

//load all assets that will be used.

function preload() {
    boom = loadSound('assets/boom.mp3');
    tss = loadSound('assets/tss.mp3')
    myFont = loadFont('assets/Gulim.ttf');
    drumLoad(128);
}


function setup() {
    createCanvas(window.innerWidth, window.innerHeight);

    //load settings for all modes: perhaps move this to happen upon role selection.

    //boomTss
    boomLoad();
    tssLoad();
    gradientLoad();

    //gradients


    socket = io.connect();


    // socket.on('acceptingMaster',function(_master){
    //     acceptingMaster = _master;
    // });

    // socket.on('iAmMaster',function(_iAmKinged){
    //     iAmMaster = _iAmKinged;
    // });

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
        if (mode == 'welcome') {
            fade = 0;
        }
    });

    socket.on('tssEcho', function (start) {
        if (start == 1) {
            setTimeout(tssEcho, random(200, 1000));
        }
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

    noStroke();

} //end of setup

//single sound events triggered by server...visualization in draw? With settings passed through from audio events.


function draw() {

    if (master == true) {
        if (mode == 'welcome') {
            chooseMode();
        }
        if (mode == 'boomTss') {
            boomer();
        }
        if (mode == 'gradients') {
            gradientMaster(500);
        }
        if (mode == 'drumPass') {
            drumViz();
        }
    }
    if (master == false) {
        if (mode == 'welcome') {
            welcomeViz();
        }
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

}

function chooseMode() {
    background(255);
    fill(0);
    textSize(24);
    textAlign(CENTER);
    rectMode(CENTER);
    text('Choose mode:\n1: Boom/Tss\n2:Gradients\n3:drumPass', width / 2, 100);
    //text('1: Boom/Tss',width/2,100);
}


function boomer() {
    background(255);
    boomPlay(frameCount % 500);
    fill(0);
    ellipse(width / 2, height / 2, boomLevel * 500, boomLevel * 500);
}

function welcomeViz() {
    var fontSize = width * 0.1;
    fade += 1;
    background(0);
    fill(255, fade);
    textFont(myFont);
    textSize(fontSize);
    textAlign(CENTER);
    text('welcome', width / 2, height / 2);
    rectMode(CENTER);
    fill(255, map(abs(sin(radians(frameCount * 2))), 0, QUARTER_PI, 0, 255));
    textSize(fontSize * 0.25);
    text('Click to join.', width / 2, height / 2 + (fontSize), textWidth('Click to join.') * 1.75, fontSize);
}

function windowResized() {
    resizeCanvas(window.innerWidth, window.innerHeight);
}

function touchStarted() {
    if (mode == 'welcome' && master == false) {
        socket.emit('ready');
    }
}

function keyPressed() {
    if (key === '1' || key === '2' || key === '3') {
        if (clientNumber == 0) {
            if (key === '1') {
                mode = 'boomTss';
            }
            if (key === '2') {
                mode = 'gradients';
            }
            if (key === '3') {
                mode = 'drumPass';
            }
            socket.emit('newMode', mode);
        }
    }
}