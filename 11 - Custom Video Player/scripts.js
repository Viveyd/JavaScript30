const [playBtn, rewindBtn, fastForwardBtn] = [... document.querySelectorAll(".player__button")];
const video = document.querySelector("video.player__video.viewer");
const volumeSlider = document.querySelector("input[name='volume']");
const playbackRateSlider = document.querySelector("input[name='playbackRate']");
const progressCon = document.querySelector(".player__controls .progress");
const progressFill = document.querySelector(".player__controls .progress__filled"); // aka PF
progressFill.style.flexBasis = "0%";

let isHoldingSlider = false;
let isPlaying = false;
let interval;
let clientXForSpace;

playBtn.addEventListener("click", togglePlay);
video.addEventListener("ended", () => {
    togglePlay("off");
})
volumeSlider.addEventListener("input", changeVolume);
playbackRateSlider.addEventListener("input", changePlaybackRate);
rewindBtn.addEventListener("click", (e) => changeCurrentTime(video.currentTime + (Number(e.target.getAttribute("data-skip")))));
fastForwardBtn.addEventListener("click", (e) => changeCurrentTime(video.currentTime + (Number(e.target.getAttribute("data-skip")))));
window.addEventListener("keypress", (e) => {
    if(e.key === " " && isHoldingSlider === true){
        setPFMaxWidthToCursor(clientXForSpace);
        setCurrentTimeToCursor(clientXForSpace);
        togglePlay("on");
        isHoldingSlider = false;
    } else if(e.key === " ") togglePlay();
})
progressCon.addEventListener("mousedown", (e) => {
    setPFMaxWidthToCursor(e.clientX);
    setCurrentTimeToCursor(e.clientX);
    togglePlay("off");
    isHoldingSlider = true;
});
window.addEventListener("mouseup", (e) => {
    if(isHoldingSlider === true){
        setPFMaxWidthToCursor(e.clientX);
        setCurrentTimeToCursor(e.clientX);
        togglePlay("on");
    }
    isHoldingSlider = false;
});
window.addEventListener("mousemove", (e) => {
    if(isHoldingSlider === true){
        setPFMaxWidthToCursor(e.clientX);
        setCurrentTimeToCursor(e.clientX);
    }
    clientXForSpace = e.clientX;
})

function setPFMaxWidthToCursor(cursorLeftPos){
    const progressConBounds = progressCon.getBoundingClientRect();
    const newWidth = cursorLeftPos - progressConBounds.left;
    progressFill.style.flexBasis = newWidth + "px";
}

function togglePlay(cmd){
    if(cmd === "on" || isPlaying === false){
        isPlaying = true;
        playBtn.innerHTML = '❚❚';
        video.play();
        interval = setInterval(updateScrubber, 650);
    } else if (cmd === "off" || isPlaying === true){
        isPlaying = false;
        playBtn.textContent = "►";
        video.pause();
        clearInterval(interval);
    }
}

function updateScrubber(){
    progressFill.style.flexBasis = (video.currentTime / video.duration) * 100 + "%";
}

function changeVolume(e){
    video.volume = e.target.value;
}

function changePlaybackRate(e){
    video.playbackRate = e.target.value;
}

function setCurrentTimeToCursor(cursorLeftPos){
    const progressConBounds = progressCon.getBoundingClientRect();
    let newTime = ((cursorLeftPos - progressConBounds.left) / progressConBounds.width * 100) / 100 * video.duration;
    changeCurrentTime(newTime);
}

function changeCurrentTime(newTime){
    if(newTime < 0) newTime = 0;
    else if(newTime > video.duration) newTime = video.duration;
    video.currentTime = newTime;
}

