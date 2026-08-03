import { getDist, mapToCanvas } from "./utils.js";
import { themes, PINCH_THRESHOLD } from "./config.js";
import { createShockwave } from "./physics.js";
import { triggerZap, playSound, resetSound } from "./audio.js";

function fingerOpen(hand, tip, pip) {
    return hand[tip].y < hand[pip].y;
}

function detectGesture(hand) {

    const thumbOpen = Math.abs(hand[4].x - hand[3].x) > 0.03;

    const indexOpen = fingerOpen(hand, 8, 6);
    const middleOpen = fingerOpen(hand, 12, 10);
    const ringOpen = fingerOpen(hand, 16, 14);
    const pinkyOpen = fingerOpen(hand, 20, 18);

    // Open Hand
    if (
        thumbOpen &&
        indexOpen &&
        middleOpen &&
        ringOpen &&
        pinkyOpen
    ) {
        return "OPEN";
    }

    // Fist
    if (
        !indexOpen &&
        !middleOpen &&
        !ringOpen &&
        !pinkyOpen
    ) {
        return "FIST";
    }

    // Point
    if (
        indexOpen &&
        !middleOpen &&
        !ringOpen &&
        !pinkyOpen
    ) {
        return "POINT";
    }

    // Peace
    if (
        indexOpen &&
        middleOpen &&
        !ringOpen &&
        !pinkyOpen
    ) {
        return "PEACE";
    }

    // Thumbs Up
    if (
        thumbOpen &&
        !indexOpen &&
        !middleOpen &&
        !ringOpen &&
        !pinkyOpen
    ) {
        return "THUMBS";
    }

    return "NONE";
}

export function detectGestures(state, ui) {

    if (!state.currentHands || state.currentHands.length === 0) {

        ui.gesture.textContent = "No Hand";
        resetSound(state);
        return;
    }

    state.currentHands.forEach((hand, idx) => {

        const thumb = hand[4];
        const index = hand[8];

        const pinchDist = getDist(thumb, index);
        const isPinching = pinchDist < PINCH_THRESHOLD;

        if (isPinching && !state.lastPinchState[idx]) {

            const midpoint = {
                x: (thumb.x + index.x) / 2,
                y: (thumb.y + index.y) / 2,
            };

            createShockwave(
                state,
                mapToCanvas(midpoint, state),
                themes[state.currentTheme](
                    state.time,
                    idx,
                    state.currentHands.length
                )
            );

            triggerZap(state);

            ui.gesture.textContent = "PINCH";
        }

        state.lastPinchState[idx] = isPinching;

        if (isPinching) return;

        const gesture = detectGesture(hand);
                switch (gesture) {

            case "OPEN":
                ui.gesture.textContent = "OPEN HAND";
                // Open hand - no sound
resetSound(state);
                break;

            case "FIST":
                ui.gesture.textContent = "FIST";
                playSound(state, "explosion");
                break;

            case "POINT":
                ui.gesture.textContent = "POINT";
                playSound(state, "laser");
                break;

            case "PEACE":
                ui.gesture.textContent = "PEACE";
                playSound(state, "success");
                break;

            case "THUMBS":
                ui.gesture.textContent = "THUMBS UP";
                playSound(state, "success");
                break;

            default:
                ui.gesture.textContent = "HAND";
                resetSound(state);
                break;
        }

        // Finger spread %
        const spread = getDist(hand[8], hand[20]);
        const spreadPct = Math.min(Math.round(spread * 300), 100);
        ui.spread.textContent = spreadPct + "%";

    });

}