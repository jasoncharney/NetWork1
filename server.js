var port = 3000;
var connectedUsers = new Array();
var numConnections;
var isMasterConnected = false;
var masterID;
var currentMode;

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

//Create control page – serve up separately, add to its own room.
//define levels of clients, send back to controller page to re-organize/switch modes/roles
//clients connected are separate from control page connections (force only one control page at a time)
// var controlPage = io.of('/control');

// controlPage.on('connection', controlConnect);

// function controlConnect(socket){
//   console.log('Controller connected');
//   socket.join('control');
//   socket.on('hi',function(){
//     console.log('hiii');
//     controlPage.emit('hi','hi');
//   });
// }

io.sockets.on('connection', onConnect);

function onConnect(socket) {
  //on connection, trigger "welcome" function
  socket.emit('mode', 'welcome');
  var socketID = socket.id;
  connectedUsers.push(socketID);
  numConnections = connectedUsers.length;
  console.log('New client. Total connected: ' + connectedUsers.length);
  var connectionIndex = connectedUsers.indexOf(socketID);
  socket.emit('clientNumber', connectionIndex);

  //listen for 'ready' function: when user clicks screen.

  socket.on('ready', function () {
    socket.emit('mode', currentMode);
  });

  socket.on('hi', function(o){
    console.log(o);
  });

  //newMode can only come from the master device!
  socket.on('newMode', function (modeSelect) {
    currentMode = modeSelect;
    socket.broadcast.emit('mode', currentMode);

    if (currentMode == 'drumPass') {
      socket.emit('drumPassStart', 1);
    }
  });

  socket.on('drumEnd', function (_clientNumber) {
    var nextClient;
    if (_clientNumber < connectedUsers.length - 1) {
      nextClient = _clientNumber + 1;
    } else {
      nextClient = 0;
    }
    socket.to(connectedUsers[nextClient]).emit('drumPass', 1);
  });

  socket.on('boomplay', function (boomplaying) {
    socket.broadcast.emit('tssEcho', 1);
  });

  //When user disconnects, echo in console.

  //if user was master, allow new masters to join (must refresh if already role 1/waiting)

  socket.on('disconnect', function () {
    var socketID = socket.id;
    if (socket.id === masterID) {
      console.log('Master disconnected!');
      isMasterConnected = false;
    }
    connectedUsers.splice(connectedUsers.indexOf(socketID), 1);

    console.log('Disconnect. Clients connected: ' + connectedUsers.length);

    //update each client with a new position in the spliced array
    for (i = 0; i < connectedUsers.length; i++) {
      socket.to(connectedUsers[i]).emit('clientNumber', connectedUsers.indexOf(connectedUsers[i]));
    }
  });
}