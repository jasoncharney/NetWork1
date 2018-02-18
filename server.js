var port = 3000;
var connectedUsers = new Array();
var numConnections;
var isMasterConnected = false;
var masterID;

//node server set up

var express = require('express'); //import Express module
var app = express();//store the result of express(); in a variable called app
var server = app.listen(port);//open the port on the port

app.use(express.static('public'));
//app.use(express.static('master-computer'));

console.log("Socket server is open on port: "+ port);

var socket = require('socket.io');//import socket package

var io = socket(server);//use the server as a socket

io.sockets.on('connection', onConnect);

function onConnect(socket){
  //on connection, trigger "welcome" function
  socket.emit('role', 'welcome', 0);

  //let them know if they can become master upon pressing correct key
  if (isMasterConnected == false){
    console.log(isMasterConnected);
    socket.emit('acceptingMaster',true);
  }

  //listen for makeMeMaster: no master is connected, and user presses correct key (hidden)
  //master is now connected, and all clients receive "accepting master" as false
   socket.on('makeMeMaster',function(kingMe){
    if (kingMe == 1){
      masterID = socket.id;
      socket.emit('role', 'master');
      console.log('Master is connected at device: ' + socket.id);
      isMasterConnected = true;
      socket.broadcast.emit('acceptingMaster',false);
    }
  });

  //listen for 'ready' function: when user clicks screen.

  socket.on('ready',function(ready){
    //when they click, advance to next role.
    if (ready == 1){
      socket.emit('role', 'tss');
      }
  });
  
  socket.on('boomplay',function(boomplaying){
    socket.broadcast.emit('tssEcho', 1);
  });

  //When user disconnects, echo in console.
  //if user was master, allow new masters to join (must refresh if already role 1/waiting)

  socket.on('disconnect',function(){
    // var socketid = socket.id;
    if (socket.id === masterID){
      console.log('Master disconnected!');
      isMasterConnected = false;
    }

  });
  if (isMasterConnected == false){
    socket.broadcast.emit('acceptingMaster',false);
  }
}





//http.listen(3000);

//////////////////////////////////////////
//from the socket test example before

// io.sockets.on('connection', function (socket){
//   var socketid = socket.id;
//   console.log('new connection: '+ socketid);
//   connectedUsers.push(socketid);
  
//   numConnections = connectedUsers.length;

//   var i = connectedUsers.indexOf(socketid);
//   console.log(numConnections);
//   socket.emit('hey',socketid);
//   socket.emit('role',i);
//   socket.on('mastersync',function(syncFrame){
//     socket.broadcast.emit('sync',syncFrame);
//   });
//     socket.on('disconnect', function(socket){
//       console.log('user disconnected: '+socketid);
//       var remove = connectedUsers.indexOf(socketid);
//       connectedUsers.splice(remove,1);
//       console.log(connectedUsers.length);
//     });
// });

