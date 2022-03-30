function startOsc() {
  
  var sctx = new SurroundContext(window,10,10,10);
  ctx = sctx.audioContext;
  
  s = sctx.createSource();
  
  xPos = 0;
  yPos = 0;
  zPos = 0;
  
  // create a gain node to gate the sound on and off
  g = ctx.createGain();
  g.connect(s.input);
  g.gain.setValueAtTime(0, ctx.currentTime);
  
  // create and start an oscillator
  o = ctx.createOscillator();
  o.type = 'sine';
  o.frequency.setValueAtTime(440, ctx.currentTime);
  o.connect(g);
  o.start(0);
}

function updateValues() {
	document.querySelector('#xVal').innerHTML = xPos;
	document.querySelector('#yVal').innerHTML = yPos;
	document.querySelector('#zVal').innerHTML = zPos;
}

function playSound() {
	g.gain.setTargetAtTime(1, ctx.currentTime, 0.02);
	g.gain.setTargetAtTime(0, ctx.currentTime+0.5, 0.02);
}

function moveSound(x,y,z) {
	xPos = xPos + x;
	yPos = yPos + y;
	zPos = zPos + z;
	s.setPosition(xPos,yPos,zPos);
    updateValues();
	playSound();
}