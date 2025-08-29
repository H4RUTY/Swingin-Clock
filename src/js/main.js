const hourNeedle = document.getElementById("hour");
const minuteNeedle = document.getElementById("minute");
const secondNeedle = document.getElementById("second");

function showClock() {
    const date = new Date();
    const h = date.getHours();
    const m = date.getMinutes();
    const s = date.getSeconds();

    hourNeedle.style.transform = `rotate(${h * 30 + m/2 - 90}deg)`;
    minuteNeedle.style.transform = `rotate(${6 * m - 90}deg)`;
    secondNeedle.style.transform = `rotate(${6 * s - 90}deg)`;

    const ms = date.getMilliseconds();
    setTimeout(showClock, 1000 - ms);
}

showClock();