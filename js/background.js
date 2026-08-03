import { themes, MATRIX_FONT_SIZE } from './config.js';

export function initMatrixColumns(state) {
  const maxColumns = Math.floor(state.width / MATRIX_FONT_SIZE);
  state.matrixColumns = new Array(maxColumns)
    .fill(1)
    .map(() => Math.random() * (state.height / MATRIX_FONT_SIZE));
}

export function drawBackground(bgCtx, state) {
  // Fade out previous frame's drops, leaving a transparent trail
  bgCtx.globalCompositeOperation = 'destination-out';
  bgCtx.fillStyle = `rgba(0, 0, 0, ${0.15 + Math.min(state.handVelocities * 10, 0.5)})`;
  bgCtx.fillRect(0, 0, state.width, state.height);
  bgCtx.globalCompositeOperation = 'source-over';

  bgCtx.fillStyle = themes[state.currentTheme](state.time, 1, 1);
  bgCtx.font = MATRIX_FONT_SIZE + 'px monospace';

  // Matrix speed boosts when hands move fast
  const speedMult = 1 + state.handVelocities * 100;

  for (let i = 0; i < state.matrixColumns.length; i++) {
    if (Math.random() > 0.95) {
      const char = String.fromCharCode(0x30a0 + Math.random() * 96);
      bgCtx.fillText(char, i * MATRIX_FONT_SIZE, state.matrixColumns[i] * MATRIX_FONT_SIZE);
    }

    state.matrixColumns[i] += Math.random() * speedMult;

    if (state.matrixColumns[i] * MATRIX_FONT_SIZE > state.height && Math.random() > 0.9) {
      state.matrixColumns[i] = 0;
    }
  }
}
