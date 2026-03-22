const canvas = document.getElementById("paintCanvas");
const ctx = canvas.getContext("2d");

// Ajustar tamaño del canvas
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - document.querySelector(".toolbar").offsetHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// Pincel
let selectedEmoji = null;
let isDrawing = false;

// Toolbar botones
document.querySelectorAll(".emoji-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        if (btn.classList.contains("gif-btn")) {
            selectedEmoji = btn.dataset.src;
        } else {
            selectedEmoji = btn.textContent;
        }
    });
});

// Dibujar
function draw(x, y) {
    if (!selectedEmoji) return;

    let size = window.innerWidth < 600 ? 40 : 50; // tamaño según dispositivo

    if (selectedEmoji.startsWith("http")) {
        const img = new Image();
        img.src = selectedEmoji;
        img.onload = () => {
            ctx.drawImage(img, x - size/2, y - size/2, size, size);
        };
    } else {
        ctx.font = `${size}px serif`;
        ctx.fillText(selectedEmoji, x - size/2, y + size/2);
    }
}

// Eventos mouse/touch
canvas.addEventListener("mousedown", e => { isDrawing = true; draw(e.offsetX, e.offsetY); });
canvas.addEventListener("mousemove", e => { if(isDrawing) draw(e.offsetX, e.offsetY); });
canvas.addEventListener("mouseup", () => { isDrawing = false; });
canvas.addEventListener("mouseleave", () => { isDrawing = false; });

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