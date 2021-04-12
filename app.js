//the video width and height the more the value the slower it will be
const Height = 50;
const Width = 50;

const video = document.getElementById("videoInput");
const video1 = document.getElementById("videoInput1");
const divMain = document.getElementById("main");
video.height = Height;
video.width = Width;

const FPS = 30;
let stream;
let streaming = false;
let h = innerHeight / Height;
let w = innerWidth / Width;
let divs = [];
for (let i = 0; i < Width; i++) {
  for (let j = 0; j < Height; j++) {
    let div = document.createElement("div");
    div.style.display = "inline-block";
    div.style.height = h + "px";
    div.style.width = w + "px";
    div.style.backgroundColor = "black";
    divs.push(div);

    divMain.appendChild(div);
  }
}
let arabicWordsArray = "دجحخهعغفقثصضشسيبلاتنمكطظزوةىﻻرؤءئ".split("");
function onReady() {
  video.play();
  video1.play();
  console.log("ready");
  let src;
  let dst;
  let cap;

  video.controls = true;
  video.addEventListener("play", start);
  video.addEventListener("pause", stop);
  video.addEventListener("ended", stop);

  function start() {
    console.log("playing...");
    streaming = true;
    const width = video.width;
    const height = video.height;
    src = new cv.Mat(height, width, cv.CV_8UC4);
    dst = new cv.Mat(height, width, cv.CV_8UC1);
    cap = new cv.VideoCapture(video);
    //console.log(src);
    setTimeout(processVideo, 0);
  }

  function stop() {
    console.log("paused or ended");
    streaming = false;
  }

  function processVideo() {
    if (!streaming) {
      src.delete();
      dst.delete();
      return;
    }
    const begin = Date.now();
    cap.read(src);
    cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);
    cv.threshold(dst, dst, 127, 255, cv.THRESH_BINARY);
    let h = 0;
    let x = 0;
    // I WISH THERE WERE A BETTER WAY
    for (let i = 0; i < Height; i += 1) {
      for (let j = 0; j < Width; j += 1) {
        if (dst.data[Width * i + j] == 255) {
          divs[h].innerText = arabicWordsArray[x++];
          x = x % arabicWordsArray.length;
          divs[h].style.overflow = "hidden";
          divs[h].style.color = "white";
        } else {
          divs[h].style.background = "black";
          divs[h].innerText = ``;
        }
        h++;
      }
    }
    const delay = 1000 / FPS - (Date.now() - begin);
    setTimeout(processVideo, delay);
  }
}
let playing = 0;
let btnMain = document.querySelector("#btn");
btnMain.addEventListener("click", () => {
  if (!playing) {
    btnMain.innerText = "Pause";
    onReady();
    playing = 1;
  } else if (playing === 1) {
    btnMain.innerText = "Resume";
    playing = 2;
    video.pause();
    video1.pause();
  } else {
    playing = 1;
    btnMain.innerText = "Pause";
    video.play();
    video1.play();
  }
});
