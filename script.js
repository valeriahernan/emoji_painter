const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Ajuste pantalla
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

// GIFs
const gifSources = [
  "https://raw.githubusercontent.com/valeriahernan/emoji_painter/refs/heads/main/gifs/5.gif",
  "https://raw.githubusercontent.com/valeriahernan/emoji_painter/refs/heads/main/gifs/2.gif",
  "https://raw.githubusercontent.com/valeriahernan/emoji_painter/refs/heads/main/gifs/3.gif"
];

const gifs = [];
let gifsReady = false;

// Cargar gifs correctamente
let loaded = 0;

gifSources.forEach(src => {
  const img = new Image();
  img.src = src;

  img.onload = () => {
    loaded++;
    if (loaded === gifSources.length) {
      gifsReady = true;
      console.log("GIFs listos");
    }
  };

  gifs.push(img);
});

// Estado
let currentGif = 0;
let brushSize = 100;

// Dibujar
function draw(x, y) {
  if (!gifsReady) return;

  const img = gifs[currentGif];

  ctx.drawImage(
    img,
    x - brushSize / 2,
    y - brushSize / 2,
    brushSize,
    brushSize
  );

  if (navigator.vibrate) navigator.vibrate(5);
}

// Touch
canvas.addEventListener("touchstart", (e) => {
  e.preventDefault();
  const t = e.touches[0];
  draw(t.clientX, t.clientY);
}, { passive: false });

canvas.addEventListener("touchmove", (e) => {
  e.preventDefault();
  const t = e.touches[0];
  draw(t.clientX, t.clientY);
}, { passive: false });

// Mouse
canvas.addEventListener("mousemove", (e) => {
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

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Bloquear scroll
document.addEventListener("touchmove", function(e) {
  e.preventDefault();
}, { passive: false });