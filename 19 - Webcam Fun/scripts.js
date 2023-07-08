const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');


getVideo();
video.addEventListener('canplay',paintSnapshotToCanvas);

function takePhoto(){
    snap.currentTime = 0;
    snap.play();

    const imgData = canvas.toDataURL('img/jpg');
    const link = document.createElement("a");
    link.href = imgData;
    link.setAttribute("download", "pic")
    link.innerHTML = `<img src=${imgData} alt= "pic">`;
    strip.insertBefore(link, strip.firstElementChild);
}

function paintSnapshotToCanvas(){
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    return setInterval(() => { // get a snapshot img and display it to canvas every 16 seconds
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        let pixels = ctx.getImageData(0,0, canvas.width, canvas.height);
        pixels = greenScreen(pixels);
        // Other Effects below:
        // pixels = redEffect(pixels);
        // pixels = splitEffect(pixels);
        // ctx.globalAlpha = 0.1;
        ctx.putImageData(pixels, 0, 0);
    }, 16)
}

function redEffect(pixels){ 
    for(let i = 0; i < pixels.data.length; i += 4){
        pixels.data[i + 0] += 200;
        pixels.data[i + 1] -= 50;
        pixels.data[i + 2] *= 0.5;
    }
    return pixels;
}

function splitEffect(pixels){
    for(let i = 0; i < pixels.data.length; i += 4){
        pixels.data[i - 150] = pixels.data[i + 0];
        pixels.data[i + 500] = pixels.data[i + 1];
        pixels.data[i - 550] = pixels.data[i + 2];
    }
    return pixels;
}

function greenScreen(pixels){
    const levels = {};
    [... document.querySelectorAll(".rgb input")].forEach(slider => {
        levels[slider.name] = slider.value;
    });

    for(let i = 0; i < pixels.data.length; i += 4){
        let r,g,b,a;
        r = pixels.data[i];
        g = pixels.data[i + 1];
        b = pixels.data[i + 2];
        a = pixels.data[i + 3];

        if(
        (r >= levels.rmin && r <= levels.rmax) &&
        (g >= levels.gmin && g <= levels.gmax) &&
        (b >= levels.bmin && b <= levels.bmax)
        ){
            pixels.data[i+3] = 0;
        }
    }
    return pixels;
}

function getVideo(){
    navigator.mediaDevices.getUserMedia({video: true, audio: false})
    .then(localMediaStream => {
        // localMediaStream contains the media file but still needs parsing
        video.srcObject = localMediaStream;
        video.play();
    })
    .catch(err => {
        console.log(err);
    });
}
