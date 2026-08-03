// ===============================
// Audio Manager
// ===============================

const sounds = {
    pinch: new Audio("assets/audio/pinch.wav"),
    explosion: new Audio("assets/audio/explosion.wav"),
    laser: new Audio("assets/audio/laser.wav"),
    success: new Audio("assets/audio/success.wav"),
    ambient: new Audio("assets/audio/ambient.mp3")
};

// ===============================
// Audio Settings
// ===============================

sounds.ambient.loop = true;
sounds.ambient.volume = 0.15;

sounds.pinch.volume = 1.0;
sounds.explosion.volume = 1.0;
sounds.laser.volume = 0.9;
sounds.success.volume = 0.9;

// Preload all sounds
Object.values(sounds).forEach(sound => {
    sound.preload = "auto";
});

// ===============================
// Initialize Audio
// ===============================

export function initAudio(state) {

    state.sounds = sounds;

    state.lastPlayedSound = "";

    // Compatibility with old code
    state.audioCtx = true;

    sounds.ambient.play().catch(() => {});
}

// ===============================
// Play Sound
// ===============================

export function playSound(state, name) {

    if (!state.sounds) return;

    const sound = state.sounds[name];

    if (!sound) return;

    // Prevent repeating the same sound continuously
    if (state.lastPlayedSound === name) return;

    state.lastPlayedSound = name;

    sound.pause();
    sound.currentTime = 0;

    sound.play().catch(() => {});
}

// ===============================
// Reset Sound Lock
// ===============================

export function resetSound(state) {

    if (!state) return;

    state.lastPlayedSound = "";
}

// ===============================
// Pinch Compatibility
// ===============================

export function triggerZap(state) {

    playSound(state, "pinch");
}

// ===============================
// MediaPipe Compatibility
// ===============================

export function updateHum(state) {

    // Reserved for future effects
}

// ===============================
// Stop Ambient Music
// ===============================

export function stopAmbient(state) {

    if (!state.sounds) return;

    state.sounds.ambient.pause();
    state.sounds.ambient.currentTime = 0;
}

// ===============================
// Resume Ambient Music
// ===============================

export function startAmbient(state) {

    if (!state.sounds) return;

    state.sounds.ambient.play().catch(() => {});
}

// ===============================
// Stop All Sounds
// ===============================

export function stopAllSounds(state) {

    if (!state.sounds) return;

    Object.values(state.sounds).forEach(sound => {
        sound.pause();
        sound.currentTime = 0;
    });

    state.lastPlayedSound = "";
}

// ===============================
// Export
// ===============================

export { sounds };