const canvas = document.getElementById("paintCanvas");
const ctx = canvas.getContext("2d");
const fileInput = document.getElementById("fileInput");

// Ajustar tamaño canvas
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - document.querySelector(".toolbar").offsetHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

let selectedSticker = null;
let isDrawing = false;
let gifAnimation = true; // si los GIFs se animan
let history = []; // historial de deshacer

// ===========================
// Funciones historial
// ===========================
function saveState() {
    history.push(canvas.toDataURL());
}

function undo() {
    if(history.length === 0) return;
    const lastState = history.pop();
    const img = new Image();
    img.src = lastState;
    img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
    };
}

// ===========================
// Botones de selección
// ===========================
document.querySelectorAll(".emoji-btn, .gif-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".tool-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        if(btn.classList.contains("gif-btn")){
            selectedSticker = btn.dataset.src;
        } else {
            selectedSticker = btn.textContent;
        }
    });
});

// Toggle animación GIF
document.getElementById("toggleGif").addEventListener("click", e => {
    gifAnimation = !gifAnimation;
    e.target.classList.toggle("active", gifAnimation);
});

// Subir imagen
document.getElementById("uploadImage").addEventListener("click", () => fileInput.click());
fileInput.addEventListener("change", e => {
    const file = e.target.files[0];
    if(!file) return;
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => { selectedSticker = img.src; fileInput.value = ''; };
});

// Botón Deshacer (reemplaza New Canvas)
const undoBtn = document.getElementById("newCanvas");
undoBtn.textContent = "↩ Deshacer";
undoBtn.addEventListener("click", undo);

// ===========================
// Dibujar
// ===========================
function draw(x,y){
    if(!selectedSticker) return;
    saveState(); // Guardamos antes de dibujar cada sticker/GIF

    let size = window.innerWidth < 600 ? 30 : 60;

    if(selectedSticker.startsWith("http") && gifAnimation){
        // GIF animado flotante
        const gif = document.createElement("img");
        gif.src = selectedSticker;
        gif.style.position = "absolute";
        gif.style.left = `${x - size/2}px`;
        gif.style.top = `${y - size/2}px`;
        gif.style.width = `${size}px`;
        gif.style.height = "auto";
        gif.style.pointerEvents = "none";
        document.body.appendChild(gif);
    } else {
        ctx.font = `${size}px serif`;
        ctx.fillText(selectedSticker, x - size/2, y + size/2);
    }
}

// ===========================
// Eventos mouse
// ===========================
canvas.addEventListener("mousedown", e => { isDrawing = true; draw(e.offsetX,e.offsetY); });
canvas.addEventListener("mousemove", e => { if(isDrawing) draw(e.offsetX,e.offsetY); });
canvas.addEventListener("mouseup", () => { isDrawing = false; });
canvas.addEventListener("mouseleave", () => { isDrawing = false; });

// ===========================
// Eventos touch
// ===========================
canvas.addEventListener("touchstart", e => {
    e.preventDefault(); isDrawing=true;
    const touch = e.touches[0]; const rect=canvas.getBoundingClientRect();
    draw(touch.clientX-rect.left, touch.clientY-rect.top);
});
canvas.addEventListener("touchmove", e => {
    e.preventDefault(); if(!isDrawing) return;
    const touch = e.touches[0]; const rect=canvas.getBoundingClientRect();
    draw(touch.clientX-rect.left, touch.clientY-rect.top);
});
canvas.addEventListener("touchend", () => { isDrawing=false; });