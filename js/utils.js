export function getDist(p1, p2) {
  return Math.hypot(p1.x - p2.x, p1.y - p2.y);
}

// Convert a normalized MediaPipe landmark (0..1) into canvas pixel coordinates.
// Canvas is horizontally mirrored via CSS, so we map coordinates directly (the
// mirroring is purely visual and handled by transform: scaleX(-1)).
export function mapToCanvas(point, state) {
  return { x: point.x * state.width, y: point.y * state.height };
}
