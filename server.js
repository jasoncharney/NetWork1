var port = 3000;
var connectedUsers = new Array();
var numConnections;
var isMasterConnected = false;
var masterID;
var currentMode;
var boomRepeat;
var nextDrum = 0;

//set the interaction changes for new connections

var LEVEL1 = 0;
var LEVEL2 = 4;
var LEVEL3 = 8;
var LEVEL4 = 12;

//SET UP NODE SERVER

var express = require('express'); //import Express module
var app = express(); //store the result of express(); in a variable called app
var server = app.listen(port); //open the port on the port

app.use(express.static('public'));
app.use(express.static('control'));

console.log("Socket server is open on port: " + port);

var socket = require('socket.io'); //import socket package

var io = socket(server); //use the server as a socket
var controller = io.of('/controller');
var client = io.of('/client');

//Create control page – serve up separately, add to its own room.
//define levels of clients, send back to controller page to re-organize/switch modes/roles
//clients connected are separate from control page connections (force only one control page at a time)

controller.on('connection',onControllerConnect);
client.on('connection', onClientConnect);

function onControllerConnect(socket){
  socket.on('newMode', function (modeSelect) {
    console.log(modeSelect);
    currentMode = modeSelect;


    client.emit('mode', currentMode);

      boomPlayer(currentMode);

      if (currentMode == 'drumPass'){
     }
     drumDistributor(currentMode);

  });
      socket.on('shineItUp', function (g) {
        client.emit('shineItUp');
      });
      socket.on('createShockwave', function (g) {
        client.emit('createShockwave');
      });
    }

 //client connection functions//   
function onClientConnect(socket) {
  client.emit('mode', currentMode);
  var socketID = socket.id;
  connectedUsers.push(socketID);

  numConnections = connectedUsers.length;

  controller.emit('numClients',numConnections);
  controller.emit('clientList',connectedUsers);

  var connectionIndex = connectedUsers.indexOf(socketID);

  socket.emit('clientNumber', connectionIndex);

  socket.on('boomHasPlayed', function () {
    socket.broadcast.emit('tssEcho');
  });

  socket.on('waveNumber',function(_waveNumber,_waveDirection,_posx,_posy,_velx,_vely){
    //console.log(_waveNumber);
    socket.broadcast.emit('addWave',_waveDirection,_posx,_posy,_velx,_vely);
  })
  socket.on('drumEnd',function(){
    nextDrum += 1;
    drumDistributor(currentMode);
  });

  //User disconnect functions.

  socket.on('disconnect', function() {
    var socketID = socket.id;
    if (socket.id === masterID) {
      console.log('Master disconnected!');
      isMasterConnected = false;
    }
    connectedUsers.splice(connectedUsers.indexOf(socketID), 1);
    
    //update each client with a new position in the spliced array
    for (i = 0; i < connectedUsers.length; i++) {
      socket.to(connectedUsers[i]).emit('clientNumber', connectedUsers.indexOf(connectedUsers[i]));
    }
    numConnections = connectedUsers.length;
    controller.emit('numClients',numConnections);
  });
}

function boomPlayer(curMode){
  if (curMode == 'boomTss'){
  boomRepeat = setInterval(boomEmit,5000);
  }
  if (curMode !== 'boomTss') {
    clearInterval(boomRepeat);
    client.to(connectedUsers[0]).emit('boomPlay',0);
  }
}

function boomEmit(){
    client.to(connectedUsers[0]).emit('boomPlay',1);
}

function drumDistributor(curMode){
  //setInterval(socket.to(connectedUsers[nextClient]).emit('drumPass');)
  if (curMode == 'drumPass'){
  var drumDelayTimes = [1, 2, 4];
  var baseDelayTime = 100;
  setTimeout(drumSender, baseDelayTime * drumDelayTimes[Math.floor(Math.random() * drumDelayTimes.length)]);
  }
}

function drumSender(){
    //nextDrum += 1;
    nextDrum = nextDrum % connectedUsers.length;
    console.log(nextDrum);
    client.to(connectedUsers[nextDrum]).emit('drumPass',1);
}

///DRUM SET UP
