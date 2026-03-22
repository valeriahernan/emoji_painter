document.addEventListener('DOMContentLoaded', () => {

  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');

  const gifButtons = document.querySelectorAll('.gif-btn');
  const sizeInput = document.getElementById('size');
  const uploadInput = document.getElementById('upload');
  const effectSelect = document.getElementById('effectSelect');
  const clearBtn = document.getElementById('clearBtn');
  const fadeBtn = document.getElementById('fadeBtn');
  const saveImageBtn = document.getElementById('saveImage');
  const shareBtn = document.getElementById('shareBtn');

  let currentGIF = gifButtons[0].src;
  let brushSize = parseInt(sizeInput.value);
  let isDrawing = false;
  let fadeEnabled = true;

  // Ajusta canvas
  function resizeCanvas() {
    if(window.innerWidth < 768){
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    } else {
      canvas.width = window.innerWidth * 0.8;
      canvas.height = window.innerHeight * 0.8;
      canvas.style.margin = "auto";
      canvas.style.display = "block";
    }
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  // GIF buttons
  gifButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      gifButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentGIF = btn.src;
    });
  });

  sizeInput.addEventListener('input', () => { brushSize = parseInt(sizeInput.value); });

  clearBtn.addEventListener('click', () => ctx.clearRect(0,0,canvas.width,canvas.height));

  // Fade toggle
  fadeBtn.addEventListener('click', () => {
    fadeEnabled = !fadeEnabled;
    fadeBtn.textContent = `Fade: ${fadeEnabled ? 'ON' : 'OFF'}`;
  });

  // Guardar imagen
  saveImageBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'mi_dibujo.png';
    link.href = canvas.toDataURL();
    link.click();
  });

  // Compartir
  shareBtn.addEventListener('click', async () => {
    try {
      const blob = await new Promise(resolve => canvas.toBlob(resolve));
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
      alert('Imagen copiada al portapapeles!');
    } catch(e){
      alert('No se pudo compartir, tu navegador no lo soporta.');
    }
  });

  // Subir imagen
  uploadInput.addEventListener('change', e => {
    const file = e.target.files[0];
    const img = new Image();
    img.onload = () => ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    if(file) img.src = URL.createObjectURL(file);
  });

  // Dibujar GIFs centrados verticalmente
  function draw(x, y) {
    const img = new Image();
    img.src = currentGIF;
    img.onload = () => {
      const offsetY = (img.height / img.width) * brushSize / 2;
      ctx.drawImage(img, x - brushSize / 2, y - offsetY, brushSize, brushSize);
    }
  }

  // Eventos de dibujo
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

  // Loop de fade
  function fadeCanvas() {
    if(fadeEnabled){
      ctx.fillStyle = 'rgba(155, 89, 182, 0.05)'; 
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    requestAnimationFrame(fadeCanvas);
  }
  fadeCanvas();

});