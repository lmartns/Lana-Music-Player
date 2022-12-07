const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");
const repeatButton = document.getElementById("repeat");
const shuffleButton = document.getElementById("shuffle");
const audio = document.getElementById("audio");
const songImage = document.getElementById("song-image");
const songArtist = document.getElementById("song-artist");
const songName = document.getElementById("song-name");
const pauseButton = document.getElementById("pause");
const playButton = document.getElementById("play");
const playlistButton = document.getElementById("playlist");
const maxDuration = document.getElementById("max-duration");
const currentTimeRef = document.getElementById("current-time");
const progressBar = document.getElementById("progress-bar");
const playlistContainer = document.getElementById("playlist-container");
const closeButton = document.getElementById("close-button");
const playlistSongs = document.getElementById("playlist-songs");
const currentProgress = document.getElementById("current-progress");

let index;

let loop = true;

const songList = [
  {
    name: "Norman fucking Rockwell",
    link: "music/Norman fucking Rockwell.mp3",
    artist: "Lana Del Rey",
    image: "image/norman.png",
  },
  {
    name: "West Coast",
    link: "music/Lana Del Rey - West Coast.mp3",
    artist: "Lana Del Rey",
    image: "image/west.png",
  },
  {
    name: "Young And Beautiful",
    link: "music/Lana Del Rey - Young and Beautiful.mp3",
    artist: "Lana Del Rey",
    image: "image/young.png",
  },
  {
    name: "Brooklyn Baby",
    link: "music/Lana Del Rey - Brooklyn Baby.mp3",
    artist: "Lana Del Rey",
    image: "image/brooklyn.jpg",
  },
  {
    name: "Without You",
    link: "music/Without You.mp3",
    artist: "Lana Del Rey",
    image: "image/without.jpg",
  },
];

let events = {
  mouse: {
    click: "click",
  },
  touch: {
    click: "touchstart",
  },
};

let deviceType = "";

const isTouchDevice = () => {
  try {
    document.createEvent("TouchEvent");
    deviceType = "touch";
    return true;
  } catch (e) {
    deviceType = "mouse";
    return false;
  }
};

const timeFormatter = (timeInput) => {
  let minute = Math.floor(timeInput / 60);
  minute = minute < 10 ? "0" + minute : minute;
  let second = Math.floor(timeInput % 60);
  second = second < 10 ? "0" + second : second;
  return `${minute}:${second}`;
};

const setSong = (arrayIndex) => {
  let { name, link, artist, image } = songList[arrayIndex];
  audio.src = link;
  songName.innerHTML = name;
  songArtist.innerHTML = artist;
  songImage.src = image;
  audio.onloadedmetadata = () => {
    maxDuration.innerText = timeFormatter(audio.duration);
  };
};

const playAudio = () => {
  audio.play();
  pauseButton.classList.remove("hide");
  playButton.classList.add("hide");
};

repeatButton.addEventListener("click", () => {
  if (repeatButton.classList.contains("active")) {
    repeatButton.classList.remove("active");
    audio.loop = false;
  } else {
    repeatButton.classList.add("active");
    audio.loop = true;
  }
});

const nextSong = () => {
  if (loop) {
    if (index == songList.length - 1) {
      index = 0;
    } else {
      index += 1;
    }
    setSong(index);
    playAudio();
  } else {
    let randIndex = Math.floor(Math.random() * songList.length);
    setSong(randIndex);
    playAudio();
  }
};

const pauseAudio = () => {
  audio.pause();
  pauseButton.classList.add("hide");
  playButton.classList.remove("hide");
};

const previousSong = () => {
  if (index > 0) {
    pauseAudio();
    index -= 1;
  } else {
    index = songList.length - 1;
  }
  setSong(index);
  playAudio();
};

audio.onended = () => {
  nextSong();
};

shuffleButton.addEventListener("click", () => {
  if (shuffleButton.classList.contains("active")) {
    shuffleButton.classList.remove("active");
    loop = true;
    console.log("shuffle off");
  } else {
    shuffleButton.classList.add("active");
    loop = false;
    console.log("shuffle on");
  }
});

playButton.addEventListener("click", playAudio);

nextButton.addEventListener("click", nextSong);

pauseButton.addEventListener("click", pauseAudio);

prevButton.addEventListener("click", previousSong);

playlistSongs.addEventListener("click", playAudio);

playlistSongs.addEventListener("click", () => {
  playlistContainer.classList.add("hide");
});

isTouchDevice();
progressBar.addEventListener(events[deviceType].click, (event) => {
  let coordStart = progressBar.getBoundingClientRect().left;

  let coordEnd = !isTouchDevice() ? event.clientX : event.touches[0].clientX;

  let progress = (coordEnd - coordStart) / progressBar.offsetWidth;

  currentProgress.style.width = progress * 100 + "%";

  audio.currentTime = progress * audio.duration;

  audio.play();
  pauseButton.classList.remove("hide");
  playButton.classList.add("hide");
});

setInterval(() => {
  currentTimeRef.innerHTML = timeFormatter(audio.currentTime);
  currentProgress.style.width =
    (audio.currentTime / audio.duration.toFixed(3)) * 100 + "%";
});

audio.addEventListener("timeupdate", () => {
  currentTimeRef.innerText = timeFormatter(audio.currentTime);
});

const initializePlaylist = () => {
  for (let i in songList) {
    playlistSongs.innerHTML += `<li class='playlistSong' onclick='setSong(${i})'>
          <div class="playlist-image-container">
              <img src="${songList[i].image}"/>
          </div>
          <div class="playlist-song-details">
              <span id="playlist-song-name">
                  ${songList[i].name}
              </span>
              <span id="playlist-song-artist-album">
                  ${songList[i].artist}
              </span>
          </div>
      </li>`;
  }
};

playlistButton.addEventListener("click", () => {
  playlistContainer.classList.remove("hide");
});

closeButton.addEventListener("click", () => {
  playlistContainer.classList.add("hide");
});

window.onload = () => {
  index = 0;
  setSong(index);
  initializePlaylist();
};
