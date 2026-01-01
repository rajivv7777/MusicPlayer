const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

searchBtn.addEventListener("click", searchSongs);
searchInput.addEventListener("keypress", e => {
    if (e.key === "Enter") searchSongs();
});

const statusText = document.getElementById("status");

function searchSongs() {
    const query = searchInput.value.trim();
    if (!query) return;

    statusText.textContent = "🔍 Searching songs...";

    fetch(`http://localhost:5000/api/search?q=${query}`)
        .then(res => res.json())
        .then(data => {
            songs = data.data;

            if (!songs || songs.length === 0) {
                statusText.textContent = "❌ No songs found";
                return;
            }

            statusText.textContent = `🎵 ${songs.length} songs found`;
            currentSongIndex = 0;
            loadSong(currentSongIndex);
            renderSongList();
        })
        .catch(err => {
            console.error(err);
            statusText.textContent = "⚠️ Server error. Try again.";
        });
}
/* song list*/
const songListEl = document.getElementById("songList");

function renderSongList() {
    songListEl.innerHTML = "";

    songs.forEach((song, index) => {
        const div = document.createElement("div");
        div.className = "song-item";
        div.innerHTML = `
            <img src="${song.album.cover_small}">
            <div>
                <strong>${song.title}</strong><br>
                <small>${song.artist.name}</small>
            </div>
        `;

        div.addEventListener("click", () => {
            currentSongIndex = index;
            loadSong(index);
            audio.play();
            updateActiveSong();
        });

        songListEl.appendChild(div);
    });

    updateActiveSong();
}

function updateActiveSong() {
    document.querySelectorAll(".song-item").forEach((item, i) => {
        item.classList.toggle("active", i === currentSongIndex);
    });
}

