// Web Audio API context
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let currentSource = null;
const buffers = {};
let intensity = 0;

async function loadbuffer(name) {
    const response = await fetch(`audio/${name}.wav`);
    const arrayBuffer = await response.arrayBuffer();
    return await audioCtx.decodeAudioData(arrayBuffer);
}

async function preload() {
    for (let i = 0; i <= 5; i++) {
        buffers[`swing0${i}`] = await loadbuffer(`swing0${i}`);
    }
    console.log("all audio files preloaded.");
}

function playLoopingBuffer(newBuffer) {
    const waitTime = (1000 - new Date().getMilliseconds()) / 1000;    // not ms but s
    const startTime = audioCtx.currentTime + waitTime;

    const source = audioCtx.createBufferSource();
    const gainNode = audioCtx.createGain();
    source.buffer = newBuffer;
    source.loop = true;
    source.connect(gainNode).connect(audioCtx.destination);

    // fade in
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(1, startTime + 0.05);
    source.start(startTime);

    // fade out
    if (currentSource) {
        const oldGain = currentSource.gainNode;
        oldGain.gain.cancelScheduledValues(startTime);
        oldGain.gain.setValueAtTime(oldGain.gain.value, startTime);
        oldGain.gain.linearRampToValueAtTime(0, startTime + 0.05);
        currentSource.source.stop(startTime + 0.05);
    }

    currentSource = { source, gainNode };
}

// -- UI --
const plusBtn = document.getElementById("plus");
const minusBtn = document.getElementById("minus");

function updatePosition() {
    const circle = document.querySelector(".circle");
    const step = window.innerWidth <= 767 ? 34 : 48;
    circle.style.left = `${step * intensity - 5}px`;
}

plusBtn.addEventListener("click", () => {
    if (intensity < 5) {
        intensity++;
        updatePosition();
        playLoopingBuffer(buffers[`swing0${intensity}`]);
    }
});

minusBtn.addEventListener("click", () => {
    if (intensity > 0) {
        intensity--;
        updatePosition();
        playLoopingBuffer(buffers[`swing0${intensity}`]);
    }
});

window.addEventListener("resize", updatePosition);

// -- initial processing --
document.getElementById("gotIt").addEventListener("click", async () => {
    // countermeasure for strict browser
    if (audioCtx.state === "suspended") {
        await audioCtx.resume();
    }
    
    const modal = document.querySelector(".modal");
    modal.classList.add("hidden");
    setTimeout(() => {
        modal.style.display = "none";
    }, 1000);

    playLoopingBuffer(buffers[`swing0${intensity}`]);
});

preload().then(() => {
    updatePosition();
})