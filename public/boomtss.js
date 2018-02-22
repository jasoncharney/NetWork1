//MODE: boom-tss.
//Description: master lets out a really big boom. Everyone else sizzles

function boomLoad(){
    boomAmp = new p5.Amplitude();
    boomAmp.setInput(boom);
}

function tssLoad(){
    tssEnv = new p5.Env();
    tssEnv.setADSR(0.1,0.1,0.5,3);
    tss.amp(tssEnv);
    tssAmp = new p5.Amplitude();
    tssAmp.setInput(tss);
    tssFFT = new p5.FFT(1., 256);
    tssFFT.setInput(tss);
    tssFFTEase = new p5.Ease();
    for (i = 0; i < tssParticles.length; i++){
        tssParticles[i] = createVector(random(width),random(height));
    }
    for (i = 0; i < tssParticles.length; i++){
        tssVelocity[i] = createVector(random(-5,5),random(-5,5),1);
    }
}

function boomPlay(boomTrigger){
    boomLevel = boomAmp.getLevel();
    if (boomTrigger == 1){
        boom.rate(random(0.5,1.));
        boom.play();
        socket.emit('boomplay',1);
    }
}

function tssEcho(){
    tssEnv.setADSR(0.01,0.1,random(0.3,1),random(1,5));
    tss.rate(random(0.9,1.5));
    tss.play();
    tssEnv.play(tss, 0, random(0,2));
    // for (i = 0; i < tssParticles.length; i++){
    //     tssParticles[i] = (random(width),random(height));
    // }
}

function tssViz(){
    background(0);
    noFill();
    var tssLevel = tssFFT.waveform();
    for (i = 0; i < tssParticles.length; i++){
        stroke(255);
        strokeWeight(1.);
        if (tssParticles[i].x > width || tssParticles[i].x < 0){
            tssVelocity[i].z = -tssVelocity[i].z;
            tssVelocity[i].x = random(-5,5);
        }
        if (tssParticles[i].y > height || tssParticles[i].y < 0){
            tssVelocity[i].z = -tssVelocity[i].z;
            tssVelocity[i].y = random(-5,5);
        }
        tssParticles[i].x += tssVelocity[i].x * tssVelocity[i].z;
        tssParticles[i].y += tssVelocity[i].y * tssVelocity[i].z;
        ellipse(tssParticles[i].x,tssParticles[i].y,(abs(tssLevel[i]))*100,(abs(tssLevel[i]))*100);
        //ellipse(tssParticles[i].x,tssParticles[i].y,20,20);

    }
}