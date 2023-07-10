const timerBtns = document.querySelectorAll(".timer__controls .timer__button");
const timerTb = document.querySelector(".timer__controls input[type='text']");
const form = document.querySelector("form");
const timeRemainingDisplay = document.querySelector(".display__time-left");
const endTimeDisplay = document.querySelector(".display__end-time");
const beepSound = new Audio("./alarm.mp3");
let interval;
timerTb.placeholder = "hh:mm:ss"

function setTimer(totalSecs){
    if(typeof totalSecs === "string") totalSecs = parseStrToSecs(totalSecs);
    const endTime_UnixMS = new Date().getTime() + (totalSecs * 1000);
    updateRemainingTime(endTime_UnixMS);
    clearInterval(interval);
    interval = setInterval(() => updateRemainingTime(endTime_UnixMS), 100);
    endTimeDisplay.textContent = new Date(endTime_UnixMS).toLocaleTimeString();
}

function updateRemainingTime(endTime_UnixMS){
    let hours, mins, secs;
    secs = Math.round((endTime_UnixMS - new Date().getTime())/1000);
    if(secs <= 0){
        timeRemainingDisplay.textContent = "0s";
        beepSound.play();
        return clearInterval(interval);
    }
    hours = secs >= 3600 ? Math.floor(secs / 3600): 0;   
    secs -= (3600 * hours);
    mins = secs >= 60 ? Math.floor(secs / 60): 0;
    secs -= (60 * mins);    
    timeRemainingDisplay.textContent = `${!hours ? "": hours+"h"} ${!mins ? "": mins+"m"} ${secs}s`;
}

function parseStrToSecs(str){
    const split = str.split(":")
    if(split.length === 1) return Number(split[0]);
    else if(split.length === 2) return Number(split[0]) * 60 + Number(split[1]);
    else if(split.length >= 3) return Number(split[0]) * 3600 + Number(split[1]) * 60 + Number(split[2]);
}

form.addEventListener("submit", (e) => {
    e.preventDefault();
    if(!timerTb.value) return;
    setTimer(timerTb.value)
    timerTb.value = "";
})

timerBtns.forEach(btn => btn.addEventListener("click", (e) => setTimer(Number(e.target.dataset.time))));
beepSound.addEventListener("ended", () => {
    beepSound.currentTime = 0;
    beepSound.play();
})