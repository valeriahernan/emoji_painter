const canvas = document.getElementById("paintCanvas");
const ctx = canvas.getContext("2d");

// Ajustar tamaño del canvas
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - document.querySelector(".toolbar").offsetHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// Variables
let selectedEmoji = null;
let isDrawing = false;

// Botones
document.querySelectorAll(".emoji-btn, .gif-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        if (btn.classList.contains("gif-btn")) {
            selectedEmoji = btn.dataset.src;
        } else {
            selectedEmoji = btn.textContent;
        }
    });
});

// Nuevo lienzo
document.getElementById("newCanvas").addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// Dibujar
function draw(x, y) {
    if (!selectedEmoji) return;

    let size = window.innerWidth < 600 ? 40 : 50;

    if (selectedEmoji.startsWith("http")) {
        const img = new Image();
        img.src = selectedEmoji;
        img.onload = () => {
            ctx.drawImage(img, x - size / 2, y - size / 2, size, size);
        };
    } else {
        ctx.font = `${size}px serif`;
        ctx.fillText(selectedEmoji, x - size / 2, y + size / 2);
    }
}

// Eventos mouse
canvas.addEventListener("mousedown", e => { isDrawing = true; draw(e.offsetX, e.offsetY); });
canvas.addEventListener("mousemove", e => { if(isDrawing) draw(e.offsetX, e.offsetY); });
canvas.addEventListener("mouseup", () => { isDrawing = false; });
canvas.addEventListener("mouseleave", () => { isDrawing = false; });

// Eventos touch
canvas.addEventListener("touchstart", e => {
    e.preventDefault();
    isDrawing = true;
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    draw(touch.clientX - rect.left, touch.clientY - rect.top);
});
canvas.addEventListener("touchmove", e => {
    e.preventDefault();
    if (!isDrawing) return;
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    draw(touch.clientX - rect.left, touch.clientY - rect.top);
});
canvas.addEventListener("touchend", () => { isDrawing = false; });