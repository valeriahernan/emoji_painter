const canvas = document.getElementById("canvas");
let drawing = false;
let currentGif = document.querySelector(".gif-btn").src;
let fadeEnabled = true;
let customBrushes = [];
const maxBrushes = 5;
let lastX = 0;
let lastY = 0;

// Selección de GIF
document.querySelectorAll(".gif-btn").forEach(btn=>{
  btn.addEventListener("click",(e)=>{
    e.stopPropagation();
    document.querySelectorAll(".gif-btn").forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    currentGif = btn.src;
  });
});

// Subir GIF
document.getElementById("upload").addEventListener("change",(e)=>{
  const file = e.target.files[0];
  if(!file) return;
  const url = URL.createObjectURL(file);
  currentGif = url;
});

// Guardar pincel
document.getElementById("saveBrush").addEventListener("click",()=>{
  if(customBrushes.length >= maxBrushes){
    alert("Máximo 5 pinceles");
    return;
  }
  const effect = "normal";
  customBrushes.push({ src: currentGif, effect });
  saveToStorage();
  renderBrushes();
});

// Renderizar pinceles
function renderBrushes(){
  const container = document.getElementById("brushes");
  container.innerHTML = "";

  customBrushes.forEach((brush, index)=>{
    const wrapper = document.createElement("div");
    wrapper.style.position = "relative";

    const img = document.createElement("img");
    img.src = brush.src;
    img.className = "brush";
    img.onclick = ()=>{ currentGif = brush.src; };

    const del = document.createElement("button");
    del.textContent = "✖";
    del.className = "delete-btn";
    del.onclick = (e)=>{
      e.stopPropagation();
      customBrushes.splice(index,1);
      saveToStorage();
      renderBrushes();
    };

    wrapper.appendChild(img);
    wrapper.appendChild(del);
    container.appendChild(wrapper);
  });
}

// FUNCIONES DE DIBUJO
function getPointerPosition(e){
  if(e.touches && e.touches.length > 0){
    return {x: e.touches[0].clientX, y: e.touches[0].clientY, pressure: e.touches[0].force || 1};
  } else {
    return {x: e.clientX, y: e.clientY, pressure: e.pressure || 1};
  }
}

function draw(e){
  const pos = getPointerPosition(e);
  const img = document.createElement("img");
  img.className = "gif";
  img.src = currentGif;

  let baseSize = window.matchMedia("(pointer: coarse)").matches ? 60 : document.getElementById("size").value;
  let size = baseSize * (0.5 + pos.pressure);

  img.style.width = size + "px";
  img.style.left = pos.x + "px";
  img.style.top = pos.y + "px";

  canvas.appendChild(img);

  if(fadeEnabled){
    setTimeout(()=>img.remove(),2000);
  }

  lastX = pos.x;
  lastY = pos.y;
}

// MOUSE + TOUCH EVENTS
canvas.addEventListener("pointerdown", (e)=>{ drawing=true; draw(e); });
canvas.addEventListener("pointermove", (e)=>{ if(drawing) draw(e); });
canvas.addEventListener("pointerup", ()=>drawing=false);
canvas.addEventListener("pointerleave", ()=>drawing=false);

canvas.addEventListener("touchstart", (e)=>{ e.preventDefault(); drawing=true; draw(e); }, {passive:false});
canvas.addEventListener("touchmove", (e)=>{ e.preventDefault(); if(drawing) draw(e); }, {passive:false});
canvas.addEventListener("touchend", (e)=>{ drawing=false; }, {passive:false});

// Botones
document.getElementById("clearBtn").onclick = ()=> canvas.innerHTML = "";
document.getElementById("fadeBtn").onclick = (e)=>{
  fadeEnabled = !fadeEnabled;
  e.target.textContent = fadeEnabled ? "Fade: ON" : "Fade: OFF";
};
document.getElementById("saveImage").onclick = ()=>{
  html2canvas(canvas).then(c=>{
    const link = document.createElement("a");
    link.download = "arte.png";
    link.href = c.toDataURL();
    link.click();
  });
};

// Local storage pinceles
function saveToStorage(){ localStorage.setItem("brushes", JSON.stringify(customBrushes)); }
function loadFromStorage(){
  const data = localStorage.getItem("brushes");
  if(data){ customBrushes = JSON.parse(data); renderBrushes(); }
}
loadFromStorage();