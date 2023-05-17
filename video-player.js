const playPauseBtn = document.querySelector(".play-pause-btn");
const forwardBtn = document.querySelector(".frwd-btn");
const backwardBtn = document.querySelector(".bkwd-btn");
const fullScreenBtn = document.querySelector(".full-screen-btn");
const muteBtn = document.querySelector(".mute-btn");
const volumeSlider = document.querySelector(".volume-slider");
const currentTimeElement = document.querySelector(".current-time");
const totalTimeElement = document.querySelector(".total-time");
const progreesBar = document.querySelector(".progressbar-container");
const progress = document.querySelector(".progress");
const settingsBtn = document.querySelector(".set-btn button");
const speedBtn = document.querySelector(".speed");
const videoContainer = document.querySelector(".video-container");
const video = document.querySelector("video");

// progressbar-section

video.addEventListener("timeupdate", (e) => {
  let { currentTime, duration } = e.target;
  let percent = (currentTime / duration) * 100;
  progress.style.width = `${percent}%`;
});

progreesBar.addEventListener("click", (e) => {
  let timelineWidth = progreesBar.clientWidth;
  video.currentTime = (e.offsetX / timelineWidth) * video.duration;
});

const drag = (e) => {
  let timelineWidth = progreesBar.clientWidth;
  progress.style.width = `${e.offsetX}px`;
  video.currentTime = (e.offsetX / timelineWidth) * video.duration;
};

progreesBar.addEventListener("mousedown", () => {
  progreesBar.addEventListener("mousemove", drag);
});

videoContainer.addEventListener("mouseup", () => {
  progreesBar.removeEventListener("mousemove", drag);
});
//  speed-controls

// settingsBtn.addEventListener("click", e =>{
//   speedBtn.classList.toggle("show");
// });

// document.addEventListener("click", e =>{
// if(e.target.tagName !== "button" || e.target.className !== "set-btn"){
//   speedBtn.classList.remove("show");
// }
// });

// speedBtn.querySelectorAll("li").forEach(option =>{
//   option.addEventListener("click", () =>{
//     video.playbackRate = option.dataset.speed;
//     speedBtn.querySelector("active").classList.remove("active")
//     option.classList.add("active");
//   })
// });

// //Duration-section

video.addEventListener("loadeddata", () => {
  totalTimeElement.textContent = formatDuration(video.duration);
});
video.addEventListener("timeupdate", () => {
  currentTimeElement.textContent = formatDuration(video.currentTime);
});

const leadingZeroFormatter = new Intl.NumberFormat(undefined, {
  minimumIntegerDigits: 2,
});

function formatDuration(time) {
  const seconds = Math.floor(time % 60);
  const minutes = Math.floor(time / 60) % 60;
  const hours = Math.floor(time / 3600);
  if (hours === 0) {
    return `${minutes}:${leadingZeroFormatter.format(seconds)}`;
  } else {
    return `${hours}:${leadingZeroFormatter.format(
      minutes
    )}:${leadingZeroFormatter.format(seconds)}`;
  }
}

// volume button
muteBtn.addEventListener("click", toggleMute);
volumeSlider.addEventListener("input", (e) => {
  video.volume = e.target.value;
  video.muted = e.target.value === 0;
});
function toggleMute() {
  video.muted = !video.muted;
}

video.addEventListener("volumechange", () => {
  volumeSlider.value = video.volume;
  let volumeLevel;
  if (video.muted || video.volume === 0) {
    volumeSlider.value = 0;
    volumeLevel = "muted";
  } else {
    volumeLevel = "high";
  }

  videoContainer.dataset.volumeLevel = volumeLevel;
});

// fullscreen mode

if (!document?.fullscreenEnabled) {
  fullScreenBtn.style.display = "none";
}
fullScreenBtn.addEventListener("click", () => {
  fullScreenMode();
});
function fullScreenMode() {
  if (document.fullscreenElement !== null) {
    document.exitFullscreen();
    setFullscreenData(false);
  } else {
    setFullscreenData(true);
    video.requestFullscreen();
  }
}

function setFullscreenData(state) {
  video.setAttribute("data-fullscreen", !state);
}

document.addEventListener("fullscreenchange", () => {
  setFullscreenData(!document.fullscreenElement);
});

// frwd-bkwd

backwardBtn.addEventListener("click", () => {
  video.currentTime -= 5;
});

forwardBtn.addEventListener("click", () => {
  video.currentTime += 5;
});

// play/pause section

playPauseBtn.addEventListener("click", togglePlay);
video.addEventListener("click", togglePlay);

function togglePlay() {
  video.paused ? video.play() : video.pause();
}

video.addEventListener("play", () => {
  videoContainer.classList.remove("paused");
});

video.addEventListener("pause", () => {
  videoContainer.classList.add("paused");
});
