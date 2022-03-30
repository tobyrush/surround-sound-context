# Surround Context
A Web Audio context that supports surround sound

This is a JavaScript library that provides a `SurroundContext` class. Once instantiated, `SurroundContext.createSource()` returns an object (technically a `GainNode`) which other Web Audio objects can be routed to, and which can be located in virtual space using `.setPosition(x,y,z)`.

`SurroundContext` automatically detects the number of outputs available to the client's browser. If more than two channels are available, it assumes a surround sound system based on the number of outputs available, and sounds are routed to available outputs as appropriate to portray virtual location. If only two outputs are available, the system falls back to Google's Resonance Audio library to create the sound space using ambisonic techniques.

`SurroundContext`'s constructor takes four parameters: the window, and the width, height and depth of the virtual room using the same generic units for use with `.setPosition`.

Here is a simple example:

```
var ctx = new SurroundContext(window,10,10,10);
var s = ctx.createSource();
var o = ctx.audioContext.createMediaElementSource(document.querySelector('audio'));
o.connect(s.input);
s.setPosition(2.5, 2.5, -2.5);
```

In this example, a 10-unit virtual room is created, a media source present in the DOM as an <audio> element is connected to a source in that context, and the source is moved to a point 2.5 units behind, above and to the right of the listener.

Channel mappings for more than 2 speakers are not standardized, so `SurroundContext` uses the following arrangements as defaults:
  
```
  
