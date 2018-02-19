var port = 3000;
var connectedUsers = new Array();
var numConnections;
var isMasterConnected = false;
var masterID;
var currentMode;

//node server set up

var express = require('express'); //import Express module
var app = express();//store the result of express(); in a variable called app
var server = app.listen(port);//open the port on the port

app.use(express.static('public'));

console.log("Socket server is open on port: "+ port);

var socket = require('socket.io');//import socket package

var io = socket(server);//use the server as a socket

io.sockets.on('connection', onConnect);


function onConnect(socket){
  //on connection, trigger "welcome" function
  socket.emit('mode', 'welcome');
  var socketID = socket.id;
  connectedUsers.push(socketID);
  numConnections = connectedUsers.length;
  var connectionIndex = connectedUsers.indexOf(socketID);
  socket.emit('clientNumber',connectionIndex);

  //let them know if they can become master upon pressing correct key
  if (isMasterConnected == false){
    socket.emit('acceptingMaster',true);
  }

  //listen for makeMeMaster: no master is connected, and user presses correct key (hidden)
  //master is now connected, and all clients receive "accepting master" as false
  //make the 0 index master automatically... 
  socket.on('makeMeMaster',function(kingMe){
    if (kingMe == 1){
      masterID = socket.id;
      socket.emit('iAmMaster', true);
      console.log('Master is connected at device: ' + socket.id);
      isMasterConnected = true;
      socket.broadcast.emit('acceptingMaster',false);
      array_move(connectedUsers,connectedUsers.indexOf(masterID),0);
      for (i = 0; i < connectedUsers.length; i++){
        socket.to(connectedUsers[i]).emit('clientNumber',connectedUsers.indexOf(connectedUsers[i]));
      }
  
    }
  });

  //listen for 'ready' function: when user clicks screen.

  socket.on('ready',function(){
    //when they click, advance to next role. Log them in the current users array.
      socket.emit('mode', currentMode);
      });

  socket.on('newMode',function(modeSelect){
    currentMode = modeSelect;
    //console.log(currentMode);
    socket.broadcast.emit('mode',currentMode);

    if (currentMode == 'beepPass'){
      socket.emit('beepPassStart',1);
    }
  });

  socket.on('boomplay',function(boomplaying){
    socket.broadcast.emit('tssEcho', 1);
  });

  socket.on('beepEnd',function(_beepEnvTime){
    socket.to(connectedUsers[(connectedUsers.indexOf(socket.id)+1)%connectedUsers.length]).emit('beepPassStart');
  });
  //When user disconnects, echo in console.
  
  //if user was master, allow new masters to join (must refresh if already role 1/waiting)

  socket.on('disconnect',function(){
    var socketID = socket.id;
    if (socket.id === masterID){
      console.log('Master disconnected!');
      isMasterConnected = false;
    }

    connectedUsers.splice(connectedUsers.indexOf(socketID),1);

    console.log('clients connected: ' + connectedUsers.length);

    //update each client with a new position in the spliced array
    for (i = 0; i < connectedUsers.length; i++){
      socket.to(connectedUsers[i]).emit('clientNumber',connectedUsers.indexOf(connectedUsers[i]));
    }

  });

  if (isMasterConnected == false){
    socket.broadcast.emit('acceptingMaster',true);
  }
}

//for placing master at the beginning of the array (index 0)
function array_move(arr, old_index, new_index) {
  if (new_index >= arr.length) {
      var k = new_index - arr.length + 1;
      while (k--) {
          arr.push(undefined);
      }
  }
  arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
};