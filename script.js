document.addEventListener('DOMContentLoaded', () => {

  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');

  const gifButtons = document.querySelectorAll('.gif-btn');
  const sizeInput = document.getElementById('size');
  const uploadInput = document.getElementById('upload');
  const clearBtn = document.getElementById('clearBtn');
  const fadeBtn = document.getElementById('fadeBtn');
  const saveImageBtn = document.getElementById('saveImage');

  let currentGIF = gifButtons[0].src;
  let brushSize = parseInt(sizeInput.value);
  let isDrawing = false;
  let fadeEnabled = true;

  // Obtener posición relativa al canvas
  function getPointerPos(e){
    const rect = canvas.getBoundingClientRect();
    if(e.touches){
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }
  }

  // Ajustar canvas
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

  // Selección de GIFs
  gifButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      gifButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentGIF = btn.src;
    });
  });

  // Cambiar tamaño del pincel
  sizeInput.addEventListener('input', () => { brushSize = parseInt(sizeInput.value); });

  // Limpiar canvas
  clearBtn.addEventListener('click', () => ctx.clearRect(0,0,canvas.width,canvas.height));

  // Toggle fade
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

  // Subir imagen
  uploadInput.addEventListener('change', e => {
    const file = e.target.files[0];
    if(!file) return;
    const img = new Image();
    img.onload = () => ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    img.src = URL.createObjectURL(file);
  });

  // Dibujar GIF como pincel (frame estático)
  function draw(x, y){
    const img = new Image();
    img.src = currentGIF;
    img.onload = () => {
      ctx.drawImage(img, x - brushSize/2, y - brushSize/2, brushSize, brushSize);
    };
  }

  // Eventos de dibujo
  canvas.addEventListener('mousedown', e => {
    isDrawing = true;
    const pos = getPointerPos(e);
    draw(pos.x, pos.y);
  });
  canvas.addEventListener('mousemove', e => {
    if(isDrawing){
      const pos = getPointerPos(e);
      draw(pos.x, pos.y);
    }
  });
  canvas.addEventListener('mouseup', () => {isDrawing = false});
  canvas.addEventListener('mouseleave', () => {isDrawing = false});

  canvas.addEventListener('touchstart', e => {
    e.preventDefault();
    isDrawing = true;
    const pos = getPointerPos(e);
    draw(pos.x, pos.y);
  });
  canvas.addEventListener('touchmove', e => {
    e.preventDefault();
    if(isDrawing){
      const pos = getPointerPos(e);
      draw(pos.x, pos.y);
    }
  });
  canvas.addEventListener('touchend', e => {
    e.preventDefault();
    isDrawing = false;
  });

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