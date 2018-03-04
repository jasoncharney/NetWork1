var numWaves = 500;
var waveArray = new Array();

function Wave(posx, posy, velx, vely){
    this.posx = posx;
    this.posy = posy;
    this.velx = velx;
    this.vely = vely;

        this.move = function(){
            this.posx += this.velx;
            this.posy += this.vely;
        }
        this.display = function(){
            push();
            translate(this.posx,this.posy);
            ellipse(0,0,2,2);
            pop();
        }
        this.normalizePosition = function(pnx,pny){
            var clientOriginX,clientOriginY,waveDirection;

            //particle goes up
            if (0. <= pnx <= 1. && pny <= 0.){
                clientOriginX = pnx;
                clientOriginY = 1.;
                waveDirection = 'up';
            }
            //particle goes right
            if (pnx >= 1. && 0. <= pny <= 1.){
                clientOriginX = 0.;
                clientOriginY = pny;
                waveDirection = 'right';
            }
            //particle goes down
            if (0. <= pnx <= 1. && pny >= 1.){
                clientOriginX = pnx;
                clientOriginY = 0.;
                waveDirection = 'down';
            }
            //particle goes left
            if (pnx <= 0. && 0. <= pny <= 1.){
                clientOriginX = 1.;
                clientOriginY = pny;
                waveDirection = 'left';
            }
            return [clientOriginX, clientOriginY, waveDirection];
        }
        this.remove = function(index){
            if (this.posx < 0 || this.posx > width || this.posy < 0 || this.posy > height){
                waveArray.splice(index,1);
                
                var clientOriginX = this.normalizePosition(this.posx/width,this.posy/height)[0];
                var clientOriginY = this.normalizePosition(this.posx/width,this.posy/height)[1];
                var waveDirection = this.normalizePosition(this.posx/width,this.posy/height)[2];

                if (master == true){
                //normalize width/height before emitting to allow for different client screens.
                socket.emit('waveNumber',index,waveDirection,clientOriginX,clientOriginY,this.velx,this.vely);
                }
            }
        }
}

function wavePopulate(){
    for (var i = 0; i < numWaves; i++){
        waveArray.push(new Wave(random(100)+width/2,random(100)+height/2,random(-1,1),random(-1,1)));
    }
}

function wavePropagate(){
    for (var i = 0; i < waveArray.length; i++){
                waveArray[i].move();
                waveArray[i].display();
                waveArray[i].remove(i);
        }
    }
function addWave(waveDirection,posx,posy,velx,vely){
    //rescale the normalized height/width positions to the size of the client window
    var newPosx = posx*width;
    var newPosy = posy*height;
    var clientShockwave = clientNumber % 4;

    if (clientShockwave == 0 && waveDirection == 'up'){
    waveArray.push(new Wave(newPosx,newPosy,velx,vely));
    }
    if (clientShockwave == 1 && waveDirection == 'right'){
        waveArray.push(new Wave(newPosx,newPosy,velx,vely));
    }
    if (clientShockwave == 2 && waveDirection == 'down'){
        waveArray.push(new Wave(newPosx,newPosy,velx,vely));
    }
    if (clientShockwave == 3 && waveDirection == 'left'){
        waveArray.push(new Wave(newPosx,newPosy,velx,vely));
    }
}