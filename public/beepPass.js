function beepLoad(){
    beep = new p5.Oscillator();
    beep.freq(beepFund);
    beepEnv = new p5.Env();
    beepAmp = new p5.Amplitude();
    beepEnv.setADSR(random(0,0.05),random(1,2),random(0.8,1.),random(0.01,0.05));
    beep.start();
    beep.amp(beepEnv);
    beepAmp.setInput(beep);
}

function beepPlay(){
    beepEnv.play();
}

function beepViz(loc){
    background(0);
    fill(255,0,0);
    ellipse(loc,height/2,beepAmp.getLevel()*300,beepAmp.getLevel()*300);
}