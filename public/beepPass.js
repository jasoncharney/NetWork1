function beepLoad(){
    beep = new p5.Oscillator();
    beep.freq(beepFund);
    beepEnv = new p5.Env();
    beepAmp = new p5.Amplitude();
    var beepEnvAttack = 0.05;
    var beepEnvDecay = 1.;
    var beepEnvRelease = 0.5;
    beepEnvTime = (beepEnvAttack + beepEnvDecay + beepEnvRelease)*1000;
    beepEnv.setADSR(beepEnvAttack,beepEnvDecay,0.8,beepEnvRelease);
    beep.start();
    beep.amp(beepEnv);
    beepAmp.setInput(beep);
}

function beepPlay(){
    beepEnv.play();
    console.log(beepEnvTime);
    setTimeout(socket.emit('beepEnd',beepEnvTime));
}

function beepViz(loc){
    background(0);
    fill(255,0,0);
    ellipse(loc,height/2,beepAmp.getLevel()*300,beepAmp.getLevel()*300);
}