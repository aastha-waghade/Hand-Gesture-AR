// Centralized mutable state shared across modules.
// Every module imports `state` and reads/writes fields directly —
// this replaces the loose top-level `let` variables from the original script.
export const state = {
  width: window.innerWidth,
  height: window.innerHeight,

  time: 0,
  lastTime: performance.now(),
  framesThisSecond: 0,
  lastFpsTime: performance.now(),

  currentHands: [],      // latest landmarks from MediaPipe
  handVelocities: 0,     // average hand movement speed

  currentTheme: 'Rainbow',

  particles: [],
  ripples: [],

  matrixColumns: [],

  audioCtx: null,
  humOsc: null,
  humGain: null,

  lastPinchState: [false, false],
};
