document.getElementById("gotIt").addEventListener("click", async () => {
    const modal = document.querySelector(".modal")
    modal.classList.add("hidden");
    setTimeout(() => {
        modal.style.display = "none";
    }, 1000);
});



// AudioContextを作成
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// wavファイルをロードしてループ再生
async function playLoopingWav(url) {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

    const source = audioCtx.createBufferSource();
    source.buffer = audioBuffer;
    source.loop = true;          // ループ再生
    source.connect(audioCtx.destination);
    source.start(0);
}

// 8秒のwavファイルを指定
playLoopingWav("audio/swing04.wav");
