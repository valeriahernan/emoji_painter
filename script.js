const stage = document.getElementById("stage");
const slider = document.getElementById("sizeSlider");

// GIFs locales
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
    if (loaded === gifSources.length) {
      gifsReady = true;
      console.log("GIFs listos");
    }
  };
  img.onerror = () => {
    console.error("Error cargando:", src);
  };
  img.src = src;
  gifs.push(img);
});

// Estado
let currentGif = 0;
let lastDraw = 0;
const maxStamps = 250;
const isMobile = window.innerWidth <= 768;

// Dibujar (CORREGIDO)
function draw(x, y, pressure = 0.5) {
  if (!gifsReady) return;

  const now = Date.now();
  if (now - lastDraw < 25) return;
  lastDraw = now;

  // Ajuste de coordenadas (🔥 clave)
  const rect = stage.getBoundingClientRect();
  const posX = x - rect.left;
  const posY = y - rect.top;

  // Limitar elementos
  const stamps = document.querySelectorAll(".stamp");
  if (stamps.length > maxStamps) stamps[0].remove();

  const img = document.createElement("img");
  img.src = gifs[currentGif].src;
  img.className = "stamp";

  let size;

  if (isMobile) {
    size = 60 + pressure * 120;
  } else {
    size = slider.value;
  }

  img.style.left = (posX - size / 2) + "px";
  img.style.top = (posY - size / 2) + "px";
  img.style.width = size + "px";

  const rot = Math.random() * 30 - 15;
  img.style.transform = `rotate(${rot}deg)`;

  stage.appendChild(img);

  if (navigator.vibrate) navigator.vibrate(5);
}

// TOUCH
stage.addEventListener("touchstart", (e) => {
  e.preventDefault();
  const t = e.touches[0];
  draw(t.clientX, t.clientY, t.force || 0.5);
}, { passive: false });

stage.addEventListener("touchmove", (e) => {
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