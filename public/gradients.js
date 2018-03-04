var gradientOscillatorNum = 10;
var gradientShine = new Array(gradientOscillatorNum);
var gradientHarmonicDrift = new Array(gradientOscillatorNum);
var gradientEnv = new p5.Env();
var gradientHarmonicAmp = new Array(gradientOscillatorNum);
var gradientFilter = new p5.HighPass();
var shineEnv = new p5.Env();
var shineEnvLevel = new p5.Amplitude();

function gradientLoad(){
c1 = createVector(100,100,100);
c2 = createVector(127,127,127);
    for (var i = 0; i < colorLFO.length; i++){
        colorLFO[i] = new p5.Oscillator('triangle');
        colorLFO[i].disconnect();
        colorLFOAmp[i] = new p5.Amplitude();
        colorLFO[i].freq(random(0.01,0.05));
        colorLFO[i].amp(random(0.5,1.));
        colorLFO[i].phase(random(0.,1.));
        colorLFO[i].start();
        colorLFOAmp[i].setInput(colorLFO[i]);
    }
    shineEnv.setADSR(1,2,0.5,3);
    shineEnvLevel.setInput(shineEnv);
    gradientLoop.loop(1);
    //gradientLoop.rate(random(1.,2.));
    gradientLoop.disconnect();
    gradientLoop.connect(gradientFilter);
}

function gradientMaster(numRects){
    c1.x = abs(colorLFOAmp[0].getLevel())*255+map(shineEnvLevel.getLevel(),0.,1.,0,255);
    c1.y = abs(colorLFOAmp[1].getLevel())*255+map(shineEnvLevel.getLevel(),0.,1.,0,255);
    c1.z = abs(colorLFOAmp[2].getLevel())*255+map(shineEnvLevel.getLevel(),0.,1.,0,255);
    c2.x = abs(colorLFOAmp[3].getLevel())*255+map(shineEnvLevel.getLevel(),0.,1.,0,255);
    c2.y = abs(colorLFOAmp[4].getLevel())*255+map(shineEnvLevel.getLevel(),0.,1.,0,255);
    c2.z = abs(colorLFOAmp[5].getLevel())*255+map(shineEnvLevel.getLevel(),0.,1.,0,255);
    var col1 = color(c1.x,c1.y,c1.z);
    var col2 = color(c2.x,c2.y,c2.z);
    rectMode(CENTER);
    noStroke();
    for (var i = 0; i < numRects; i++){
        var colorInterp = i*(1/numRects);
        fill(lerpColor(col1,col2,colorInterp));
        rect(i*(width/numRects), height/2,(width/numRects)+1,height);
    }
    // for (var i = 0; i < gradientOscillatorNum; i++){
    //     gradientShine[i].amp(gradientHarmonicAmp[i].getLevel());
    // }
}

function gradientPlay(){
    // for (var i = 0; i < gradientOscillatorNum; i++){
    //     gradientShine[i].start();
    // }
    gradientLoop.play();
    gradientFilter.freq(100);
    gradientFilter.res(500);
}

function gradientStop(){
    // for (var i = 0; i < gradientOscillatorNum; i++){
    //     gradientShine[i].stop();
    // }
    gradientLoop.stop();
}

function shineItUp(){
    shineEnv.play();
}
