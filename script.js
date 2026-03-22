const stage = document.getElementById("stage");

// GIFs (usa archivos locales en /gifs/)
const gifSources = [
  "gifs/5.gif",
  "gifs/2.gif",
  "gifs/3.gif"
];

// Estado
let currentGif = 0;
let brushSize = 100;
let lastDraw = 0;
const maxStamps = 250;

// Dibujar (FLUIDO)
function draw(x, y) {
  const now = Date.now();
  if (now - lastDraw < 25) return; // suaviza
  lastDraw = now;

  // Limitar cantidad (rendimiento)
  const stamps = document.querySelectorAll(".stamp");
  if (stamps.length > maxStamps) {
    stamps[0].remove();
  }

  const img = document.createElement("img");
  img.src = gifSources[currentGif];
  img.className = "stamp";

  img.style.left = (x - brushSize / 2) + "px";
  img.style.top = (y - brushSize / 2) + "px";
  img.style.width = brushSize + "px";

  // leve rotación
  const rot = Math.random() * 20 - 10;
  img.style.transform = `rotate(${rot}deg)`;

  stage.appendChild(img);

  // vibración (si existe)
  if (navigator.vibrate) navigator.vibrate(5);
}

// TOUCH
stage.addEventListener("touchstart", (e) => {
  e.preventDefault();
  const t = e.touches[0];
  draw(t.clientX, t.clientY);
}, { passive: false });

stage.addEventListener("touchmove", (e) => {
  e.preventDefault();
  const t = e.touches[0];
  draw(t.clientX, t.clientY);
}, { passive: false });

// MOUSE
stage.addEventListener("mousemove", (e) => {
  if (e.buttons !== 1) return;
  draw(e.clientX, e.clientY);
});

// UI
function setGif(index) {
  currentGif = index;
}

function changeSize(size) {
  brushSize = size;
}

function clearStage() {
  stage.innerHTML = "";
}

// Bloquear scroll
document.addEventListener("touchmove", function(e) {
  e.preventDefault();
}, { passive: false });