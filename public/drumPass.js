var drumPeakDraw;
var drumNum;
function drumLoad(fftSize){
    drumNum = clientNumber % drums.length;
    for (i = 0; i < drums.length; i++){
        drums[i] = loadSound('assets/drums/'+i+'.mp3');
    }
    beepEnv = new p5.Env();
    drumAmp = new p5.Amplitude();
    drumAmp.toggleNormalize(1);
    drumFFT = new p5.FFT(1.,fftSize);
    drumAmp.setInput(drums[drumNum]);
    drumFFT.setInput(drums[drumNum]);
}

function drumPlay(){
    if (drumNum > 0){
        drums[drumNum].rate(random(1.,5.));
    }
    drums[drumNum].play();
    newDirChoose = true;
    drumPeakDraw = 20;
    //add a little bit of timed delay before triggering next client
    socket.emit('drumEnd',clientNumber);
}

function drumViz(){
    noStroke();
    fill(0,100);
    rectMode(CENTER);
    rect(width/2,height/2,width,height);
    noFill();
    stroke(255);
    if (newDirChoose = true){
        dirLimit = int(random(1,4))*int(random(1,3));
    }
    if (drumPeakDraw > 0){
        var dir = 1;
        var displacer = drumFFT.waveform();
        drumPeakDraw -= 1;
        beginShape(TRIANGLES);
        newDirChoose = false;
        for(i = 0; i < displacer.length; i++){
            var theta = (map(i,0,displacer.length,0,TWO_PI));
            var pos = displacer[i];
            if (i%dirLimit == 0){
                dir = -dir;
            }
            var x = (width/2)+(dir)+(pos*(height/2))*(cos(theta));
            var y = (height/2)+(dir)+(pos*(height/2))*(sin(theta));
            vertex(x,y);
        }
        endShape(CLOSE);
}
}