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
}

function boomPlay(boomTrigger){
    boomLevel = boomAmp.getLevel();
    if (boomTrigger == 1){
        boom.play();
        socket.emit('boomplay',1);
    }
}

function tssEcho(){
    tssEnv.setADSR(0.01,0.1,random(0.3,1),random(1,5));
    tss.rate(random(0.9,1.5));
    tss.play();
    tssEnv.play(tss, 0, random(0,2));
}