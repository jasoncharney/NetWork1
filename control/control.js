var boomTssbutton;
var drumPassbutton;
var socket;

function preload(){
}

function setup(){
    socket = io.connect();

    socket = io('/control');
    createCanvas(window.innerWidth,window.innerHeight);
    textSize(25);
    text('NetWork 1 Controls',0,25);
    boomTssbutton = createButton('boomTss');
    boomTssbutton.position(0,30);
    boomTssbutton.mousePressed(function(){
        socket.emit('hi');
    });
    
    socket.on('hi',function(){
        console.log('hi');
    });
}

function emits(){
    socket.emit('hi',1);
}

function draw(){
}

function windowResized(){
resizeCanvas(window.innerWidth,window.innerHeight);
text('NetWork 1 Controls',0,10);
}