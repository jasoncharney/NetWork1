var port = 3000;
var connectedUsers = new Array();
var numConnections;
var isMasterConnected = false;
var masterID;
var currentMode;
var boomRepeat;

//COUNT NUMBER OF SAMPLES/FILES WITHIN A FOLDER...
// var countFiles = require('count-files');

// var drumSampleNumber = countFiles('public/assets/drums/', function (err, results) {
//   console.log('done counting')
//   console.log(results) // { files: 10, dirs: 2, bytes: 234 } 
// })

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

    if (currentMode == 'drumPass') {
      client.to(connectedUsers[0]).emit('drumPassStart', 1);
    }
      boomPlayer(currentMode);
  });
      socket.on('shineItUp', function (g) {
        client.emit('shineItUp');
      });
    }
function onClientConnect(socket) {
  //on connection, trigger "welcome" function
  client.emit('mode', currentMode);
  var socketID = socket.id;
  connectedUsers.push(socketID);

  numConnections = connectedUsers.length;

  controller.emit('numClients',numConnections);
  controller.emit('clientList',connectedUsers);

  var connectionIndex = connectedUsers.indexOf(socketID);
  socket.emit('clientNumber', connectionIndex);

  socket.on('drumEnd', function (_clientNumber) {
    var nextClient;
    if (_clientNumber < connectedUsers.length - 1) {
      nextClient = _clientNumber + 1;
    } else {
      nextClient = 0;
    }
    socket.to(connectedUsers[nextClient]).emit('drumPass', 1);
  });

  socket.on('boomHasPlayed', function () {
    socket.broadcast.emit('tssEcho');
  });


  //When user disconnects, echo in console.

  //if user was master, allow new masters to join (must refresh if already role 1/waiting)

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