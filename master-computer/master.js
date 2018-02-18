var socket;
var stirrer;
function setup()
{
    socket = io('/master'); // this is named in the server file for new connections.
    socket.on('welcome',function(stir){
        stirrer = stir;
    });

    createCanvas(window.innerWidth,window.innerHeight);
    background(255,0,0);
    fill(255);
}

function draw(){
    text(str(stirrer),width/2,height/2);

}