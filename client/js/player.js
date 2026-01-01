const audio = new Audio();
let currentSongIndex = 0;
let songs=[];

/* Elements */
const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

const titleEl = document.getElementById("title");
const artistEl = document.getElementById("artist");
const coverEl = document.getElementById("cover");

const progress = document.getElementById("progress");
const currentTimeEl = document.getElementById("current-time");
const durationEl = document.getElementById("duration");
const volumeSlider = document.getElementById("volume");

/* Load Song from Deezer */
function loadSong(index) {
    if (!songs.length) {
        console.error("No songs loaded");
        return;
    }

    const song = songs[index];

    titleEl.textContent = song.title;
    artistEl.textContent = song.artist.name;
    coverEl.src = song.album.cover_medium;

    if (!song.preview) {
        alert("Preview not available for this song");
        return;
    }


    audio.src = song.preview; 
    audio.play().catch(() => {});
    console.log("Audio SRC set to:", audio.src);

    progress.value = 0;    /*smooth progress bar*/
    currentTimeEl.textContent = "0:00";
    durationEl.textContent = "0:00";

}

/* play button sync*/
audio.addEventListener("play", () => {
    playBtn.innerHTML = `<i class="fas fa-pause"></i>`;
});

audio.addEventListener("pause", () => {
    playBtn.innerHTML = `<i class="fas fa-play"></i>`;
});


/* Play / Pause */
function playPauseSong() {
    if (!audio.src) {
        alert("Search a song first 🎵");
        return;
    }

    if (audio.paused) {
        audio.play().catch(err => {
            console.error("Play failed:", err);
        });
        playBtn.innerHTML = `<i class="fas fa-pause"></i>`;
    } else {
        audio.pause();
        playBtn.innerHTML = `<i class="fas fa-play"></i>`;
    }
}

playBtn.addEventListener("click", playPauseSong);

/* Next */
nextBtn.addEventListener("click", () => {
    if (!songs.length) return;
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    loadSong(currentSongIndex);
    audio.play();
});

/* Previous */
prevBtn.addEventListener("click", () => {
    if (!songs.length) return;
    currentSongIndex =
        (currentSongIndex - 1 + songs.length) % songs.length;
    loadSong(currentSongIndex);
    audio.play();
});

/* Progress */
audio.addEventListener("timeupdate", () => {
    if (!audio.duration) return;

    progress.value = (audio.currentTime / audio.duration) * 100;
    currentTimeEl.textContent = formatTime(audio.currentTime);
    durationEl.textContent = formatTime(audio.duration);
});

/* Seek */
progress.addEventListener("input", () => {
    if (!audio.duration) return;
    audio.currentTime = (progress.value / 100) * audio.duration;
});

/* Volume */
volumeSlider.addEventListener("input", () => {
    audio.volume = volumeSlider.value;
});

/* Auto Next */
audio.addEventListener("ended", () => {
    nextBtn.click();
});

/* Time Format */
function formatTime(time) {
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60).toString().padStart(2, "0");
    return `${min}:${sec}`;
}
