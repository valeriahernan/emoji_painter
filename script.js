const stage = document.getElementById("stage");
const slider = document.getElementById("sizeSlider");

const gifSources = [
  "./gifs/5.gif",
  "./gifs/2.gif",
  "./gifs/3.gif"
];

// Precarga
const gifs = [];
let ready = false;
let loaded = 0;

gifSources.forEach(src => {
  const img = new Image();
  img.onload = () => {
    loaded++;
    if (loaded === gifSources.length) ready = true;
  };
  img.src = src;
  gifs.push(img);
});

// Estado
let currentGif = 0;
let lastDraw = 0;

function draw(x, y) {
  if (!ready) return;

  const now = Date.now();
  if (now - lastDraw < 20) return;
  lastDraw = now;

  const img = document.createElement("img");
  img.src = gifs[currentGif].src;
  img.className = "stamp";

  const size = slider.value;

  img.style.left = (x - size/2) + "px";
  img.style.top = (y - size/2) + "px";
  img.style.width = size + "px";

  stage.appendChild(img);
}

// Eventos
stage.addEventListener("mousedown", e => draw(e.clientX, e.clientY));
stage.addEventListener("mousemove", e => {
  if (e.buttons !== 1) return;
  draw(e.clientX, e.clientY);
});

stage.addEventListener("touchmove", e => {
  e.preventDefault();
  const t = e.touches[0];
  draw(t.clientX, t.clientY);
}, { passive: false });

// UI
function setGif(i) {
  currentGif = i;
}

function clearStage() {
  stage.innerHTML = "";
}