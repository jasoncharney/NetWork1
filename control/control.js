var socket = io('/controller');
var timeUp;
var refresh = 1000;
var startTime;
$(document).ready(function(){
    startTime = new Date();
    timeCount();
    $('#drumPass').click(function(){
      socket.emit('newMode','drumPass');
    });
    $('#boomTss').click(function(){
        socket.emit('newMode','boomTss');
    });
    $('#gradients').click(function(){
        socket.emit('newMode','gradients');
    });
    $('#shineItUp').click(function(){
        socket.emit('shineItUp','1');
    });
    $('#shockWave').click(function(){
        socket.emit('newMode','shockWave');
    });
    $('#createShockwave').click(function(){
        socket.emit('createShockwave','1');
    });
    $('#textFlicker').click(function(){
        socket.emit('newMode','textFlicker');
    });
    $('#grassy').click(function(){
        socket.emit('newMode','grassy');
    });

socket.on('numClients',function(numConnections){
    document.getElementById('clientsConnected').innerHTML ='Clients connected: ' + numConnections;

    });
});

function timeCount(){
    setInterval('displayTime()',refresh);
}

function displayTime(){
    var endTime = new Date();
    var timeDiff = endTime - startTime;
    timeDiff /= 1000;
    var secs = Math.round(timeDiff % 60);
    var min = Math.floor(timeDiff / 60);
    document.getElementById('timeConnected').innerHTML = 'Time up: ' + min + ":" + secs; 
}

    // document.getElementById('clientList').innerHTML ='Client list: ' + connectedUsers;