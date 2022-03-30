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
  
  Ceiling level:                  Listener's level:               Floor level:
  
  TFL---------TFC---------TFR     FL---FLC-----FC----FRC---FR     BFL---------BFC---------BFR     
  |                         |     |                         |     |                         |
  |                         |     WFL                     WFR     |                         |
  |                         |     |                         |     |                         |
  TSL          TC         TSR     SL          \o/          SR     LFE-1       LFE       LFE-2
  |                         |     |                         |     |                         |
  |                         |     |                         |     |                         |
  |                         |     |                         |     |                         |
  TBL---------TBC---------TBR     BL-----------BC----------BR     ---------------------------
  
```
  
| Speakers | Arrangement | FL | FR | FC | LFE(-1) | BL | BR | FLC | FRC | BC | LFE-2 | SL | SR | TFL | TFR | TFC | TC | TBL | TBR | TSL | TSR | TBC | BFC | BFL | BFR | WFL | WFR | WBL | WBR |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Mono |  |  | 1 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| 2 | Stereo | 1 | 2 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| 3 | 3.0 Surround | 1 | 2 |  |  |  |  |  |  | 3 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| 4 | Quadrophonic | 1 | 2 |  |  | 3 | 4 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| 5 | 4.1 Surround | 1 | 2 | 3 | 4 |  |  |  |  | 5 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| 6 | 5.1 Surround | 1 | 2 | 3 | 4 | 5 | 6 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| 7 | Hexagonal | 1 | 2 | 3 | 4 | 5 | 6 |  |  | 7 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| 8 | 7.1 Surround | 1 | 2 | 3 | 4 | 5 | 6 |  |  |  |  | 7 | 8 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| 9 | 9.0 Surround | 1 | 2 | 3 |  | 4 | 5 | 6 | 7 |  |  | 8 | 9 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| 10 | 5.1.4 Dolby Atmos | 1 | 2 | 3 | 4 | 5 | 6 |  |  |  |  |  |  | 7 | 8 |  |  | 9 | 10 |  |  |  |  |  |  |  |  |  |  |
| 11 | 11.0 Surround | 1 | 2 | 3 |  | 4 | 5 | 6 | 7 |  |  | 8 | 9 |  |  |  |  |  |  |  |  |  |  |  |  | 10 | 11 |  |  |
| 12 | 7.1.4 Dolby Atmos | 1 | 2 | 3 | 4 | 5 | 6 |  |  |  |  | 7 | 8 | 9 | 10 |  |  | 11 | 12 |  |  |  |  |  |  |  |  |  |  |
| 13 | 8.1.4 Surround* | 1 | 2 | 3 | 4 | 5 | 6 |  |  | 7 |  | 8 | 9 | 10 | 11 |  |  | 12 | 13 |  |  |  |  |  |  |  |  |  |  |
| 14 | 10.0.4 Surround* | 1 | 2 |  |  | 3 | 4 |  |  |  |  | 5 | 6 | 7 | 8 |  |  | 9 | 10 |  |  |  |  |  |  | 11 | 12 | 13 | 14 |
| 15 | 11.0.4 Surround* | 1 | 2 | 3 |  | 4 | 5 |  |  |  |  | 6 | 7 | 8 | 9 |  |  | 10 | 11 |  |  |  |  |  |  | 12 | 13 | 14 | 15 |
| 16 | 11.1.4 Dolby Atmos | 1 | 2 | 3 | 4 | 5 | 6 |  |  |  |  | 7 | 8 | 9 | 10 |  |  | 11 | 12 |  |  |  |  |  |  | 13 | 14 | 15 | 16 |
| 17 | 16.1 Surround* | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 |  | 10 | 11 | 12 | 13 |  |  | 14 | 15 | 16 | 17 |  |  |  |  |  |  |  |  |
| 18 | 17.1 Surround* | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 |  | 10 | 11 | 12 | 13 | 14 |  | 15 | 16 | 17 | 18 |  |  |  |  |  |  |  |  |
| 19 | 18.1 Surround* | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 |  | 10 | 11 | 12 | 13 | 14 |  | 15 | 16 | 17 | 18 | 19 |  |  |  |  |  |  |  |
| 20 | 19.1 Surround* | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 |  | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 |  |  |  |  |  |  |  |
| 21 | 20.1 Surround* | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 |  | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 |  |  |  |  |  |  |
| 22 | 21.1 Surround* | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 |  | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 |  | 21 | 22 |  |  |  |  |
| 23 | 22.1 Surround | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 |  | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 |  |  |  |  |
| 24 | 22.2 Surround | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 |  |  |  |  |

Arrangements marked with an asterisk (*) are not standard arrangements... they're just ones I made up to fill out the chart. Not all arrangements are present here; I just chose what I imagined to be the most common arrangement for each number of speakers.
  
### Things to add
  
- A way to allow the user to configure speaker order and placement
- Frequency filtering for LFE channels
- I'm sure my simplistic math for speaker gain (right now it's just gain is the inverse of distance) could probably use some finessing
- I'm also sure the API can be improved in lots of ways
- Dolby Surround/DTS encoding support? (I'm assuming these are proprietary so probably not a chance)
  
Big thanks to u/dmack779 for inspiration and direction on this.
  
