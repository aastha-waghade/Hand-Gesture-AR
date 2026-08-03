export function createParticles(state, pos, color, count = 3) {
  for (let i = 0; i < count; i++) {
    state.particles.push({
      x: pos.x,
      y: pos.y,
      vx: (Math.random() - 0.5) * 8,
      vy: (Math.random() - 0.5) * 8,
      life: 1.0,
      color,
      size: Math.random() * 3 + 1,
    });
  }
}

export function createShockwave(state, pos, color) {
  state.ripples.push({
    x: pos.x,
    y: pos.y,
    radius: 0,
    maxRadius: 150 + Math.random() * 100,
    life: 1.0,
    color,
  });
}

// Advances and draws particles + ripples onto the given canvas context
export function updatePhysics(ctx, state) {
  // Particles
  for (let i = state.particles.length - 1; i >= 0; i--) {
    const p = state.particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.life -= 0.02;
    p.vy += 0.1; // gravity

    if (p.life <= 0) {
      state.particles.splice(i, 1);
    } else {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.life;
      ctx.fill();
    }
  }

  // Ripples / shockwaves
  for (let i = state.ripples.length - 1; i >= 0; i--) {
    const r = state.ripples[i];
    r.radius += (r.maxRadius - r.radius) * 0.1; // ease out
    r.life -= 0.03;

    if (r.life <= 0) {
      state.ripples.splice(i, 1);
    } else {
      ctx.beginPath();
      ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
      ctx.strokeStyle = r.color;
      ctx.lineWidth = 4 * r.life;
      ctx.globalAlpha = r.life;
      ctx.stroke();
    }
  }

  ctx.globalAlpha = 1.0; // reset
}
