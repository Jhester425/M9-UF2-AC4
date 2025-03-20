const songs = [
    { title: "My Heart in MP3", src: "audio/myheart.mp3", cover: "images/1.jpg" },
    { title: "My Heart in FLAC", src: "audio/myheart.flac", cover: "images/2.jpg" },
    { title: "My Heart in OPUS", src: "audio/myheart.opus", cover: "images/3.jpg" },
    { title: "My Heart in OGG", src: "audio/myheart.ogg", cover: "images/4.jpg" },
    { title: "My Heart in WAV", src: "audio/myheart.wav", cover: "images/5.jpg" },
    { title: "My Heart in M4A", src: "audio/myheart.m4a", cover: "images/6.jpg" }
];

let currentSongIndex = 0;
const audio = document.getElementById("audio");
const cover = document.getElementById("cover");
const title = document.getElementById("title");
const playButton = document.getElementById("play");
const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");
const progress = document.getElementById("progress");

// Function to get the MIME type based on the file extension
function getAudioType(src) {
    if (src.endsWith(".mp3")) return "audio/mp3";
    if (src.endsWith(".flac")) return "audio/flac";
    if (src.endsWith(".ac3")) return "audio/ac3";
    if (src.endsWith(".ogg")) return "audio/ogg";
    if (src.endsWith(".wav")) return "audio/wav";
    if (src.endsWith(".wma")) return "audio/wma";
    return "audio/mpeg";  // Default type if none matched
}

// Load the current song
function loadSong(index) {
    const song = songs[index];
    title.textContent = song.title;
    audio.src = song.src;
    cover.src = song.cover;

    // Dynamically set the MIME type
    const audioType = getAudioType(song.src);
    const sourceElement = document.createElement('source');
    sourceElement.src = song.src;
    sourceElement.type = audioType;
    audio.innerHTML = '';  // Clear any existing sources
    audio.appendChild(sourceElement);  // Append the new source element

    audio.load(); 
}

// Play/Pause functionality
playButton.addEventListener("click", () => {
    if (audio.paused) {
        audio.play();
        playButton.textContent = "⏸";
    } else {
        audio.pause();
        playButton.textContent = "▶";
    }
});

// Next song
nextButton.addEventListener("click", () => {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    loadSong(currentSongIndex);
    audio.play();
    playButton.textContent = "⏸";
});

// Previous song
prevButton.addEventListener("click", () => {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    loadSong(currentSongIndex);
    audio.play();
    playButton.textContent = "⏸";
});

// Update progress bar
audio.addEventListener("timeupdate", () => {
    progress.value = (audio.currentTime / audio.duration) * 100;
});

// Seek through the song
progress.addEventListener("input", () => {
    audio.currentTime = (progress.value / 100) * audio.duration;
});

// Auto-play next song when current ends
audio.addEventListener("ended", () => {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    loadSong(currentSongIndex);
    audio.play();
});

// Load the first song when page loads
loadSong(currentSongIndex);


const volumeSlider = document.getElementById('volume');

// Update volume when the slider is moved
volumeSlider.addEventListener('input', (event) => {
    audio.volume = event.target.value;
});

// Song list button
const songListButton = document.getElementById("songListButton");
const songList = document.getElementById("songList");

songListButton.addEventListener("click", () => {
    songList.style.display = songList.style.display === "block" ? "none" : "block";
});

songs.forEach((song, index) => {
    const songButton = document.createElement("button");
    songButton.textContent = song.title;
    songButton.addEventListener("click", () => {
        loadSong(index);
        audio.play();
        playButton.textContent = "⏸";
        songList.style.display = "none";
    });
    songList.appendChild(songButton);
});

document.addEventListener("click", (event) => {
    if (!songListButton.contains(event.target) && !songList.contains(event.target)) {
        songList.style.display = "none";
    }
});


// Mute Unmute

const volumeIcon = document.querySelector(".fa-volume-up");

volumeIcon.addEventListener("click", () => {
    if (audio.muted) {
        audio.muted = false;
        volumeIcon.classList.remove("fa-volume-mute");
        volumeIcon.classList.add("fa-volume-up");
        volumeSlider.value = audio.volume; // Restore previous volume
    } else {
        audio.muted = true;
        volumeIcon.classList.remove("fa-volume-up");
        volumeIcon.classList.add("fa-volume-mute");
        volumeSlider.value = 0; // Show volume as 0 when muted
    }
});

// Update mute icon based on volume slider
volumeSlider.addEventListener("input", () => {
    audio.volume = volumeSlider.value;
    audio.muted = volumeSlider.value == 0;
    volumeIcon.classList.toggle("fa-volume-mute", audio.muted);
    volumeIcon.classList.toggle("fa-volume-up", !audio.muted);
});


// const audio = document.getElementById("audio");
const progressTime = document.getElementById("progress-time");

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
}

audio.addEventListener("loadedmetadata", () => {
    progressTime.textContent = `0:00 / ${formatTime(audio.duration)}`;
});

audio.addEventListener("timeupdate", () => {
    progressTime.textContent = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration || 0)}`;
});

// Seconds, Volume, Velocity functions
document.getElementById("decrease-velocity").addEventListener("click", () => {
    audio.playbackRate = Math.max(0.5, audio.playbackRate - 0.1); // Lower speed, min 0.5x
});

document.getElementById("increase-velocity").addEventListener("click", () => {
    audio.playbackRate = Math.min(2.0, audio.playbackRate + 0.1); // Increase speed, max 2x
});

document.getElementById("rewind-5").addEventListener("click", () => {
    audio.currentTime = Math.max(0, audio.currentTime - 5); // Go back 5 seconds
});

document.getElementById("forward-5").addEventListener("click", () => {
    audio.currentTime = Math.min(audio.duration, audio.currentTime + 5); // Skip 5 seconds
});

document.getElementById("decrease-volume").addEventListener("click", () => {
    audio.volume = Math.max(0, audio.volume - 0.1); // Reduce volume
});

document.getElementById("increase-volume").addEventListener("click", () => {
    audio.volume = Math.min(1, audio.volume + 0.1); // Increase volume
});



// Timer
let actualSeconds = 0;
let songSeconds = 0;
let actualTimer, songTimer;

const actualTimeDisplay = document.getElementById("actual-time");
const songTimeDisplay = document.getElementById("song-time");

function updateActualTime() {
    actualSeconds++;
    let minutes = Math.floor(actualSeconds / 60);
    let seconds = actualSeconds % 60;
    actualTimeDisplay.textContent = `Actual time: ${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function updateSongTime() {
    songSeconds++;
    let minutes = Math.floor(songSeconds / 60);
    let seconds = songSeconds % 60;
    songTimeDisplay.textContent = `Song time: ${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function startTimers() {
    clearInterval(actualTimer);
    clearInterval(songTimer);
    
    actualTimer = setInterval(updateActualTime, 1000);
    songTimer = setInterval(updateSongTime, 1000);
}

function stopTimers() {
    clearInterval(actualTimer);
    clearInterval(songTimer);
}

function resetSongTimer() {
    songSeconds = 0;
    songTimeDisplay.textContent = "Song time: 0:00";
}

// Start timers when playing
audio.addEventListener("play", startTimers);

// Stop timers when pausing
audio.addEventListener("pause", stopTimers);

// Reset song timer when a new song starts
audio.addEventListener("ended", stopTimers);
audio.addEventListener("loadeddata", resetSongTimer);


document.getElementById("decrease-volume").addEventListener("click", () => {
    audio.volume = Math.max(0, audio.volume - 0.1); // Reduce volume
    volumeSlider.value = audio.volume; // Update volume slider
});

document.getElementById("increase-volume").addEventListener("click", () => {
    audio.volume = Math.min(1, audio.volume + 0.1); // Increase volume
    volumeSlider.value = audio.volume; // Update volume slider
});


// ===================================================================

let currentIndex = 0; // Keep track of the current image index

function moveSlide(direction) {
    const images = document.querySelectorAll('.carousel-item');
    const totalImages = images.length;

    // Update the current index based on the direction
    currentIndex += direction;

    // Loop around if the index goes out of bounds
    if (currentIndex < 0) {
        currentIndex = totalImages - 1;
    } else if (currentIndex >= totalImages) {
        currentIndex = 0;
    }

    // Move the images container to show the correct image
    const carouselImages = document.querySelector('.carousel-images');
    carouselImages.style.transform = `translateX(-${currentIndex * 100}%)`;
}

// =================================================
// SweetAlert2

document.getElementById("contactForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevents actual form submission

    Swal.fire({
        icon: 'success',
        title: 'Message Sent!',
        text: 'Thank you for reaching out. We will get back to you soon.',
        confirmButtonText: 'OK'
    });

    // Optionally, clear the form fields
    this.reset();
});


document.querySelectorAll(".videos video").forEach(video => {
    video.addEventListener("click", () => {
        if (!document.fullscreenElement) {
            if (video.requestFullscreen) {
                video.requestFullscreen();
            } else if (video.mozRequestFullScreen) { /* Firefox */
                video.mozRequestFullScreen();
            } else if (video.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
                video.webkitRequestFullscreen();
            } else if (video.msRequestFullscreen) { /* IE/Edge */
                video.msRequestFullscreen();
            }

            // Force landscape mode
            screen.orientation.lock("landscape").catch(error => console.log(error));

            // Add class to apply styles
            video.classList.add("fullscreen-video");
        } else {
            document.exitFullscreen();
            screen.orientation.unlock();
            video.classList.remove("fullscreen-video");
        }
    });
});


document.addEventListener("fullscreenchange", () => {
    if (document.fullscreenElement) {
        screen.orientation.lock("landscape").catch(err => console.log(err));
    } else {
        screen.orientation.unlock();
    }
});
