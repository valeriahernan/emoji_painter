const stage = document.getElementById("stage");
const slider = document.getElementById("sizeSlider");

// GIFs
const gifSources = [
  "./gifs/5.gif",
  "./gifs/2.gif",
  "./gifs/3.gif"
];

// Precarga
const gifs = [];
let gifsReady = false;
let loaded = 0;

gifSources.forEach(src => {
  const img = new Image();
  img.onload = () => {
    loaded++;
    if (loaded === gifSources.length) gifsReady = true;
  };
  img.src = src;
  gifs.push(img);
});

// Estado
let currentGif = 0;
let lastDraw = 0;
let baseSize = 100;
const maxStamps = 250;

// Detectar mobile
const isMobile = window.innerWidth <= 768;

// Dibujar
function draw(x, y, pressure = 0.5) {
  if (!gifsReady) return;

  const now = Date.now();
  if (now - lastDraw < 25) return;
  lastDraw = now;

  const stamps = document.querySelectorAll(".stamp");
  if (stamps.length > maxStamps) stamps[0].remove();

  const img = document.createElement("img");
  img.src = gifs[currentGif].src;
  img.className = "stamp";

  let size;

  if (isMobile) {
    // 📱 tamaño por presión (si existe)
    size = 50 + pressure * 150;
  } else {
    // 💻 tamaño por slider
    size = slider.value;
  }

  img.style.left = (x - size / 2) + "px";
  img.style.top = (y - size / 2) + "px";
  img.style.width = size + "px";

  const rot = Math.random() * 30 - 15;
  img.style.transform = `rotate(${rot}deg)`;

  stage.appendChild(img);

  if (navigator.vibrate) navigator.vibrate(5);
}

// TOUCH (con presión)
stage.addEventListener("touchmove", (e) => {
  e.preventDefault();
  const t = e.touches[0];

  const pressure = t.force || 0.5; // fallback si no hay presión

  draw(t.clientX, t.clientY, pressure);
}, { passive: false });

stage.addEventListener("touchstart", (e) => {
  e.preventDefault();
  const t = e.touches[0];
  draw(t.clientX, t.clientY, t.force || 0.5);
}, { passive: false });

// MOUSE
stage.addEventListener("mousemove", (e) => {
  if (e.buttons !== 1) return;
  draw(e.clientX, e.clientY, 0.5);
});

// UI
function setGif(i) {
  currentGif = i;
}

function clearStage() {
  stage.innerHTML = "";
}

// Bloquear scroll
document.addEventListener("touchmove", e => e.preventDefault(), { passive: false });