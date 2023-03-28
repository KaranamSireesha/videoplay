const playPauseBtn = document.querySelector(".play-pause-btn");
const fullScreenBtn = document.querySelector(".full-screen-btn");
const muteBtn = document.querySelector(".mute-btn");
const volumeSlider = document.querySelector(".volume-slider");
const currentTimeElement = document.querySelector(".current-time");
const totalTimeElement = document.querySelector(".total-time");
const progress = document.querySelector(".progress");
const videoContainer = document.querySelector(".video-container");
const video = document.querySelector("video");

// progressbar-section

video.addEventListener("loadedmetadata", () => {
  progress.setAttribute("max", video.duration);
});

video.addEventListener("timeupdate", () => {
  progress.value = video.currentTime;
  progress.style.width = `${Math.floor(
    (video.currentTime * 100) / video.duration
  )}%`;
});

progress.addEventListener("mousedown", function () {
  video.pause();
});

progress.addEventListener("mouseup", function () {
  video.play();
});

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
