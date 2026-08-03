import { getDist } from './utils.js';
import { updateHum } from './audio.js';

export async function initMediaPipe(state, videoElement, ui) {

    console.log("Initializing MediaPipe...");

    const hands = new Hands({
        locateFile: (file) =>
            `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });

    hands.setOptions({
        maxNumHands: 2,
        modelComplexity: 1,
        minDetectionConfidence: 0.7,
        minTrackingConfidence: 0.7,
    });

    hands.onResults((results) => {

        console.clear();

        console.log("===== MediaPipe Callback =====");
        console.log(results);

        const landmarks = results.multiHandLandmarks || [];

        console.log("Hands Detected:", landmarks.length);

        ui.hands.innerText = landmarks.length;

        if (
            state.currentHands.length > 0 &&
            landmarks.length > 0
        ) {

            const oldP = state.currentHands[0][8];
            const newP = landmarks[0][8];

            if (oldP && newP) {
                state.handVelocities = getDist(oldP, newP);
            } else {
                state.handVelocities = 0;
            }

        } else {

            state.handVelocities = 0;

        }

        state.currentHands = landmarks;

        // Audio is optional
        if (state.audioCtx) {
            try {
                updateHum(state, landmarks);
            } catch (err) {
                console.error("Audio Error:", err);
            }
        }

    });

    const camera = new Camera(videoElement, {

        onFrame: async () => {

            console.log("Sending Camera Frame...");

            try {

                await hands.send({
                    image: videoElement,
                });

            } catch (err) {

                console.error("MediaPipe Send Error:", err);

            }

        },

        width: 1280,
        height: 720,
        facingMode: "user",

    });

    try {

        await camera.start();

        console.log("Camera Started Successfully");

    } catch (err) {

        console.error("Camera Start Failed:", err);

    }

    return {
        hands,
        camera,
    };

}