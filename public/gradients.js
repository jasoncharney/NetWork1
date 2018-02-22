function gradientLoad(){
c1 = createVector(100,100,100);
c2 = createVector(127,127,127);
for (var i = 0; i < colorLFO.length; i++){
  colorLFO[i] = new p5.Oscillator('triangle');
  colorLFOAmp[i] = new p5.Amplitude();
  colorLFO[i].freq(random(0.01,0.05));
  colorLFO[i].amp(random(0.5,1.));
  colorLFO[i].phase(random(0.,1.));
  colorLFO[i].disconnect();
  colorLFO[i].start();
  colorLFOAmp[i].setInput(colorLFO[i]);
}
}

function gradientMaster(numRects){
    c1.x = abs(colorLFOAmp[0].getLevel())*255;
    c1.y = abs(colorLFOAmp[1].getLevel())*255;
    c1.z = abs(colorLFOAmp[2].getLevel())*255;
    c2.x = abs(colorLFOAmp[3].getLevel())*255;
    c2.y = abs(colorLFOAmp[4].getLevel())*255;
    c2.z = abs(colorLFOAmp[5].getLevel())*255;
    var col1 = color(c1.x,c1.y,c1.z);
    var col2 = color(c2.x,c2.y,c2.z);
    rectMode(CENTER);
    noStroke();
    for (var i = 0; i < numRects; i++){
        var colorInterp = i*(1/numRects);
        fill(lerpColor(col1,col2,colorInterp));
        rect(i*(width/numRects), height/2,(width/numRects)+1,height);
    }
}