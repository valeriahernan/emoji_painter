const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const gifButtons = document.querySelectorAll('.gif-btn');
const sizeInput = document.getElementById('size');
const uploadInput = document.getElementById('upload');
const effectSelect = document.getElementById('effectSelect');
const clearBtn = document.getElementById('clearBtn');

let currentGIF = gifButtons[0].src;
let brushSize = parseInt(sizeInput.value);
let isDrawing = false;

// Ajusta canvas al tamaño de ventana
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Selección de GIFs
gifButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    gifButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentGIF = btn.src;
  });
});

// Cambiar tamaño del pincel
sizeInput.addEventListener('input', () => {
  brushSize = parseInt(sizeInput.value);
});

// Limpiar canvas
clearBtn.addEventListener('click', () => ctx.clearRect(0,0,canvas.width,canvas.height));

// Subir imagen
uploadInput.addEventListener('change', e => {
  const file = e.target.files[0];
  const img = new Image();
  img.onload = () => ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  if(file) img.src = URL.createObjectURL(file);
});

// Dibujar GIFs (simplificado: dibuja imagen estática del GIF)
function draw(x, y) {
  const img = new Image();
  img.src = currentGIF;
  img.onload = () => {
    // Calcula offset para centrar visualmente
    const offsetY = (img.height / img.width) * brushSize / 2; 
    ctx.drawImage(img, x - brushSize / 2, y - offsetY, brushSize, brushSize);
  }
}

// Eventos para desktop y móvil
function getPointerPos(e){
  if(e.touches) return {x: e.touches[0].clientX, y: e.touches[0].clientY};
  else return {x: e.clientX, y: e.clientY};
}

canvas.addEventListener('mousedown', e => {isDrawing = true; draw(e.clientX, e.clientY)});
canvas.addEventListener('mousemove', e => {if(isDrawing) draw(e.clientX, e.clientY)});
canvas.addEventListener('mouseup', () => {isDrawing = false});
canvas.addEventListener('mouseleave', () => {isDrawing = false});

canvas.addEventListener('touchstart', e => {e.preventDefault(); isDrawing = true; const pos=getPointerPos(e); draw(pos.x,pos.y)});
canvas.addEventListener('touchmove', e => {e.preventDefault(); if(isDrawing){const pos=getPointerPos(e); draw(pos.x,pos.y)}});
canvas.addEventListener('touchend', e => {e.preventDefault(); isDrawing = false});