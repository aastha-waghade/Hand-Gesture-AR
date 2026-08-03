import { themes, FINGER_TIPS } from './config.js';
import { getDist, mapToCanvas } from './utils.js';
import { createParticles, updatePhysics } from './physics.js';
import { drawBackground } from './background.js';
import { detectGestures } from './gestures.js';

// Draws the two-hand "mandala" pattern connecting all 10 fingertips
function drawMandala(ctx, state, h1, h2) {
  const allTips = FINGER_TIPS.map((t) => mapToCanvas(h1[t], state)).concat(
    FINGER_TIPS.map((t) => mapToCanvas(h2[t], state))
  );

  ctx.save();
  const cx = allTips.reduce((sum, p) => sum + p.x, 0) / 10;
  const cy = allTips.reduce((sum, p) => sum + p.y, 0) / 10;

  ctx.translate(cx, cy);
  ctx.rotate(state.time * 0.5);

  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const t1 = { x: allTips[i].x - cx, y: allTips[i].y - cy };
    const t2 = { x: allTips[(i + 3) % 10].x - cx, y: allTips[(i + 3) % 10].y - cy };
    ctx.moveTo(t1.x, t1.y);
    ctx.lineTo(t2.x, t2.y);
  }
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.restore();
}

// Draws connecting lines (+ occasional lightning arcs) between two hands' fingertips
function drawCrossHandLines(ctx, state, h1, h2) {
  FINGER_TIPS.forEach((tipIndex, idx) => {
    const pt1 = mapToCanvas(h1[tipIndex], state);
    const pt2 = mapToCanvas(h2[tipIndex], state);
    const dist = getDist(pt1, pt2);

    const col = themes[state.currentTheme](state.time, idx, FINGER_TIPS.length);

    // Lightning arc when very close but not touching
    if (dist < 150 && Math.random() > 0.5) {
      ctx.beginPath();
      ctx.moveTo(pt1.x, pt1.y);
      const midX = (pt1.x + pt2.x) / 2 + (Math.random() - 0.5) * 50;
      const midY = (pt1.y + pt2.y) / 2 + (Math.random() - 0.5) * 50;
      ctx.lineTo(midX, midY);
      ctx.lineTo(pt2.x, pt2.y);

      ctx.strokeStyle = '#ffffff';
      ctx.shadowBlur = 20;
      ctx.shadowColor = col;
      ctx.lineWidth = 3;
      ctx.stroke();
    }

    // Flowing gradient line
    ctx.beginPath();
    ctx.moveTo(pt1.x, pt1.y);
    ctx.lineTo(pt2.x, pt2.y);

    const grad = ctx.createLinearGradient(pt1.x, pt1.y, pt2.x, pt2.y);
    grad.addColorStop(0, themes[state.currentTheme](state.time, idx, 5));
    grad.addColorStop(0.5, themes[state.currentTheme](state.time, idx + 1, 5));
    grad.addColorStop(1, themes[state.currentTheme](state.time, idx + 2, 5));

    ctx.strokeStyle = grad;
    ctx.lineWidth = 4;
    ctx.shadowBlur = 10;
    ctx.shadowColor = col;
    ctx.stroke();
    ctx.shadowBlur = 0;
  });

  drawMandala(ctx, state, h1, h2);
}

// Draws skeleton + glowing fingertips (with spark particles) for a single hand
function drawHandSkeleton(ctx, state, hand, handIndex) {
  console.log("Drawing hand:", hand);
  const glowColor = themes[state.currentTheme](state.time, handIndex, 2);

 console.log("drawConnectors:", typeof drawConnectors);
console.log("HAND_CONNECTIONS:", typeof HAND_CONNECTIONS);
 // MediaPipe drawing_utils globals (loaded via CDN script tags in index.html)
  drawConnectors(ctx, hand, HAND_CONNECTIONS, {
    color: glowColor,
    lineWidth: 2,
  });

  ctx.shadowBlur = 15;
  ctx.shadowColor = glowColor;

  FINGER_TIPS.forEach((tipIndex, idx) => {
    const pt = mapToCanvas(hand[tipIndex], state);
    const tipCol = themes[state.currentTheme](state.time, idx, FINGER_TIPS.length);

    ctx.beginPath();
    ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();

    if (Math.random() > 0.6) {
      createParticles(state, pt, tipCol, 1);
    }
  });
  ctx.shadowBlur = 0;
}

export function createRenderLoop(ctx, bgCtx, state, ui) {
  function renderLoop(timestamp) {
    requestAnimationFrame(renderLoop);

    const dt = (timestamp - state.lastTime) / 1000;
    state.lastTime = timestamp;
    state.time += dt;

    // FPS counter
    state.framesThisSecond++;
    if (timestamp > state.lastFpsTime + 1000) {
      ui.fps.innerText = state.framesThisSecond;
      state.framesThisSecond = 0;
      state.lastFpsTime = timestamp;
    }

    if (bgCtx) {
    drawBackground(bgCtx, state);
}

    // Fade the main canvas (keeps transparency) instead of a hard clear,
    // giving fingertip trails a motion-blur look
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fillRect(0, 0, state.width, state.height);

    // Additive "screen" blend for glowy neon overlap
    ctx.globalCompositeOperation = 'lighter';

    updatePhysics(ctx, state);

    if (state.currentHands.length > 0) {

    state.currentHands.forEach((hand, handIndex) => {
        drawHandSkeleton(ctx, state, hand, handIndex);
    });

    if (state.currentHands.length >= 2) {
        drawCrossHandLines(
            ctx,
            state,
            state.currentHands[0],
            state.currentHands[1]
        );
    }

    detectGestures(state, ui);

    // Nice glowing gesture text
    if (ui.gesture) {

        ui.gesture.style.fontWeight = "bold";
        ui.gesture.style.fontSize = "26px";
        ui.gesture.style.color = "#00ffff";
        ui.gesture.style.textShadow =
            "0 0 8px cyan, 0 0 18px #00ffff";
    }

}
else{

    if(ui.gesture){
        ui.gesture.textContent="NO HAND";
    }

}
ctx.globalCompositeOperation = 'source-over';  }

  return renderLoop;
}
