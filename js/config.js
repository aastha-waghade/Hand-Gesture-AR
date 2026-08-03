// =========================
// Theme Colors
// =========================

export const themes = {

    Rainbow: (t, index, total) =>
        `hsl(${(t * 120 + index * (360 / total)) % 360}, 100%, 60%)`,

    Cyberpunk: (t, index) =>
        index % 2 === 0 ? "#ff00ff" : "#00ffff",

    Lava: (t, index) =>
        `hsl(${10 + index * 8},100%,${55 + Math.sin(t * 2) * 8}%)`,

    Ocean: (t, index) =>
        `hsl(${190 + index * 10},100%,60%)`,

    Galaxy: (t, index) =>
        `hsl(${260 + Math.sin(t * 2 + index) * 40},100%,65%)`

};


// =========================
// MediaPipe Finger Tips
// =========================

export const FINGER_TIPS = [
    4,   // Thumb
    8,   // Index
    12,  // Middle
    16,  // Ring
    20   // Pinky
];


// =========================
// Finger Base Joints
// (Useful for Gesture Detection)
// =========================

export const FINGER_PIPS = [
    3,
    6,
    10,
    14,
    18
];


// =========================
// Canvas
// =========================

export const MATRIX_FONT_SIZE = 16;


// =========================
// Gesture Thresholds
// =========================

// Pinch Detection
export const PINCH_THRESHOLD = 0.05;

// Open Hand
export const OPEN_THRESHOLD = 0.12;

// Fist
export const FIST_THRESHOLD = 0.06;

// Finger Spread
export const SPREAD_MULTIPLIER = 300;


// =========================
// Particle Settings
// =========================

export const PARTICLE_COUNT = 3;

export const RIPPLE_RADIUS = 180;

export const RIPPLE_SPEED = 0.10;


// =========================
// UI
// =========================

export const GESTURE_NAMES = {

    PINCH: "🤏 PINCH",

    OPEN: "✋ OPEN HAND",

    FIST: "✊ FIST",

    POINT: "👆 POINT",

    PEACE: "✌️ PEACE",

    THUMBS: "👍 THUMBS UP",

    NONE: "NO HAND"

};