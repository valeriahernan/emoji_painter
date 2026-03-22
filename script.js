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

// Dibujar
document.addEventListener("pointerdown",(e)=>{
  if(e.target.closest(".toolbar")) return;
  drawing = true;
  draw(e);
});
document.addEventListener("pointerup",()=> drawing = false);
document.addEventListener("pointermove",(e)=>{ if(!drawing) return; draw(e); });

function draw(e){
  const img = document.createElement("img");
  img.className = "gif";
  img.src = currentGif;

  let pressure = e.pressure || 1;
  if(window.matchMedia("(pointer: coarse)").matches) pressure = e.pressure || 1; // móvil

  let baseSize = document.getElementById("size").value;
  let size = baseSize * (0.5 + pressure);

  img.style.width = size + "px";
  img.style.left = e.clientX + "px";
  img.style.top = e.clientY + "px";

  canvas.appendChild(img);

  if(fadeEnabled){
    setTimeout(()=>img.remove(),2000);
  }

  lastX = e.clientX;
  lastY = e.clientY;
}

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