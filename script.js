const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Ajuste a pantalla real
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Variables de juego
let brushSize = 80;
let score = 0;
let time = 30;
let isPlaying = true;

// GIF actual
const gif = new Image();
gif.src = "https://raw.githubusercontent.com/valeriahernan/emoji_painter/refs/heads/main/gifs/5.gif";

// Dibujar
function draw(x, y) {
  if (!isPlaying) return;

  ctx.drawImage(gif, x - brushSize/2, y - brushSize/2, brushSize, brushSize);

  score++;
  document.getElementById("score").textContent = score;

  // Vibración (si existe)
  if (navigator.vibrate) navigator.vibrate(5);
}

// Obtener posición touch
function getTouchPos(e) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: e.touches[0].clientX - rect.left,
    y: e.touches[0].clientY - rect.top
  };
}

// Touch events
canvas.addEventListener("touchstart", (e) => {
  e.preventDefault();
  const pos = getTouchPos(e);
  draw(pos.x, pos.y);
}, { passive: false });

canvas.addEventListener("touchmove", (e) => {
  e.preventDefault();
  const pos = getTouchPos(e);
  draw(pos.x, pos.y);
}, { passive: false });

// Mouse (por si usas PC)
canvas.addEventListener("mousemove", (e) => {
  if (e.buttons !== 1) return;
  draw(e.offsetX, e.offsetY);
});

// Cambiar tamaño
function changeSize(size) {
  brushSize = size;
}

// Limpiar
function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  score = 0;
  document.getElementById("score").textContent = score;
}

// Timer
function gameLoop() {
  if (!isPlaying) return;

  if (time > 0) {
    time--;
    document.getElementById("time").textContent = time;
  } else {
    isPlaying = false;
    alert("🎮 Fin del juego! Puntaje: " + score);

    // Reset
    time = 30;
    score = 0;
    clearCanvas();
    document.getElementById("time").textContent = time;
    isPlaying = true;
  }
}

setInterval(gameLoop, 1000);

// Evitar scroll global
document.addEventListener("touchmove", function(e) {
  e.preventDefault();
}, { passive: false });