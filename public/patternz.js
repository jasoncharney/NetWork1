function Liner(horizPos,vertPos,horizSize,vertSize,minWidth,stripeAdd,stripeFill){
    this.stripeFill = stripeFill;
    this.horizPos = horizPos;
    this.vertPos = vertPos;
    this.horizSize = horizSize;
    this.vertSize = vertSize;
    this.stripeDir = 1;
    this.stripeAdd = stripeAdd;
    this.minWidth = minWidth;
    this.numStripes = 1;
    this.maxStripes = int(horizSize/minWidth);
    this.stripeWidth;
    this.lineOsc = new p5.Oscillator();
    this.lineEnv = new p5.Env();
    this.lineEnvLFO = new p5.Oscillator();
    this.lineOsc.setType('sawtooth');
    this.lineEnvLFO.setType('square');
    this.display = function(){
      fill(this.stripeFill);
      if (this.stripeWidth <= this.minWidth || this.stripeWidth > this.horizSize){
        this.stripeDir = -this.stripeDir;
        }
  
      this.numStripes += this.stripeAdd * this.stripeDir;
      this.stripeWidth = this.horizSize/this.numStripes;
      for (var i = 0; i < this.numStripes+1; i++){
        if (i % 2 == 0){
          rect(this.stripeWidth*i,this.vertPos,this.stripeWidth,this.vertSize);
          }
        }
    }
    this.sounder = function(pan,freqRangelow,freqRangehi){
      this.lineOsc.freq(map(this.numStripes,1,this.maxStripes,freqRangelow,freqRangehi));
      this.lineEnvLFO.freq(map(this.stripeWidth,this.minWidth,this.horizSize,10,1));
      this.lineEnvLFO.start();
      this.lineEnvLFO.disconnect();
      this.lineOsc.pan(pan);
      this.lineOsc.amp(this.lineEnvLFO);
      this.lineOsc.start();
    }
  }