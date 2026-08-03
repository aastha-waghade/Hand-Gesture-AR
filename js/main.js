import { state } from './state.js';
import { themes } from './config.js';
import { initAudio } from './audio.js';
import { createRenderLoop } from './render.js';
import { initMediaPipe } from './mediapipe-init.js';

const videoElement = document.querySelector('.input_video');
const bgCanvas = document.getElementById('bgCanvas');
const mainCanvas = document.getElementById('mainCanvas');

const bgCtx = bgCanvas.getContext('2d');
const ctx = mainCanvas.getContext('2d');

const ui = {
  hands: document.getElementById('ui-hands'),
  fps: document.getElementById('ui-fps'),
  gesture: document.getElementById('ui-gesture'),
  spread: document.getElementById('ui-spread'),
};

// Resize canvases
function resize() {
  state.width = window.innerWidth;
  state.height = window.innerHeight;

  bgCanvas.width = state.width;
  bgCanvas.height = state.height;

  mainCanvas.width = state.width;
  mainCanvas.height = state.height;
}

window.addEventListener('resize', resize);
resize();

// Theme Switcher
document.querySelectorAll('.theme-btn').forEach((btn) => {
  btn.addEventListener('click', (e) => {
    document
      .querySelectorAll('.theme-btn')
      .forEach((b) => b.classList.remove('active'));

    e.target.classList.add('active');

    state.currentTheme = e.target.dataset.theme;

    document.documentElement.style.setProperty(
      '--accent',
      themes[state.currentTheme](0, 1, 1)
    );
  });
});

// Start Experience
document.getElementById('startBtn').addEventListener('click', async () => {

  document.getElementById('startOverlay').classList.add('hidden');
  document.getElementById('hud').classList.remove('hidden');
  document.getElementById('themes').classList.remove('hidden');

  try {

    // Initialize audio
    initAudio(state);

    // Initialize MediaPipe
    await initMediaPipe(state, videoElement, ui);

    // Start render loop
    const renderLoop = createRenderLoop(ctx, bgCtx, state, ui);

    requestAnimationFrame(renderLoop);

  } catch (err) {

    console.error("Initialization Failed:", err);

  }

});