var xGlyphs = 100;
var yGlyphs = 50;
var glyphSize;
var glyphs = new Array();
var xGlyphSpacer;
var yGlyphSpacer;

function textLoad(){
    glyphSize = height/yGlyphs;
    xGlyphSpacer = int(width/xGlyphs);
    yGlyphSpacer = int(height/yGlyphs);
for (x=0;x<xGlyphs;x++) {
    glyphs[x]=new Array();
 for (y=0;y<yGlyphs;y++) {
    glyphs[x][y]=(int(random(32,126)));
    }
    }
}

function textFlick(){
    background(255,0,0);
    fill(255);
    textSize(glyphSize);
    textAlign(CENTER);
    for (var x = 0; x < xGlyphs; x++){
        for (var y = 0; y < yGlyphs; y++){
        text(char(glyphs[x][y]),(xGlyphSpacer*x)+xGlyphSpacer,(yGlyphSpacer*y)+yGlyphSpacer);
        }
    }
}