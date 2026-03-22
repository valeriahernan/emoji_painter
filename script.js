// =========================
// ELEMENTO PRINCIPAL
// =========================
const stage = document.getElementById("stage");

// Verificación crítica
if (!stage) {
  console.error("❌ ERROR: #stage no existe en el HTML");
}

// =========================
// GIFS (RUTA CORREGIDA)
// =========================
const gifSources = [
  "./gifs/5.gif",
  "./gifs/2.gif",
  "./gifs/3.gif"
];

// =========================
// PRECARGA (CLAVE)
// =========================
const gifs = [];
let gifsReady = false;
let loaded = 0;

gifSources.forEach((src, i) => {
  const img = new Image();

  img.onload = () => {
    loaded++;
    console.log("✅ GIF cargado:", src);

    if (loaded === gifSources.length) {
      gifsReady = true;
      console.log("🔥 TODOS LOS GIFS LISTOS");
    }
  };

  img.onerror = () => {
    console.error("❌ ERROR cargando:", src);
  };

  img.src = src;
  gifs.push(img);
});

// =========================
// ESTADO
// =========================
let currentGif = 0;
let brushSize = 100;
let lastDraw = 0;
const maxStamps = 250;

// =========================
// DIBUJO (FLUIDO)
// =========================
function draw(x, y) {
  if (!gifsReady) return; // 🔥 evita bug de carga

  const now = Date.now();
  if (now - lastDraw < 25) return;
  lastDraw = now;

  // Limitar elementos
  const stamps = document.querySelectorAll(".stamp");
  if (stamps.length > maxStamps) {
    stamps[0].remove();
  }

  const img = document.createElement("img");

  // 🔥 usar imagen precargada (más rápido)
  img.src = gifs[currentGif].src;

  img.className = "stamp";

  img.style.position = "absolute";
  img.style.left = (x - brushSize / 2) + "px";
  img.style.top = (y - brushSize / 2) + "px";
  img.style.width = brushSize + "px";

  // rotación
  const rot = Math.random() * 20 - 10;
  img.style.transform = `rotate(${rot}deg)`;

  stage.appendChild(img);

  // vibración
  if (navigator.vibrate) navigator.vibrate(5);
}

// =========================
// TOUCH
// =========================
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

// =========================
// MOUSE
// =========================
stage.addEventListener("mousemove", (e) => {
  if (e.buttons !== 1) return;
  draw(e.clientX, e.clientY);
});

// =========================
// UI
// =========================
function setGif(index) {
  currentGif = index;
}

function changeSize(size) {
  brushSize = size;
}

function clearStage() {
  stage.innerHTML = "";
}

// =========================
// BLOQUEAR SCROLL
// =========================
document.addEventListener("touchmove", function(e) {
  e.preventDefault();
}, { passive: false });