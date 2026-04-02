// 🔥 DETECTAR STATUS DESDE URL
const params = new URLSearchParams(window.location.search);
const status = params.get("status");

// 🔥 GUARDAR ID DE PAGO SI VIENE EN URL
const payment_id = params.get("payment_id");
if(payment_id){
  localStorage.setItem("pago_id", payment_id);
}

// 🔥 CONTROL DE INTERVALO
let intervalo = null;

/* =========================
   🔥 DETECTAR PAGO EXISTENTE
========================= */

// 👉 SI YA HAY UN PAGO GUARDADO Y NO HAY STATUS
const pagoGuardado = localStorage.getItem("pago_id");

if(pagoGuardado && !status){
  mostrarPendiente();
  iniciarVerificacion();
}

// ✅ PAGO EXITOSO
if(status === "approved"){
  mostrarExito();
}

// ⏳ PAGO PENDIENTE
if(status === "pending"){
  mostrarPendiente();
  iniciarVerificacion();
}

// ❌ PAGO FALLIDO
if(status === "failure"){
  document.body.innerHTML = `
    <div style="
      display:flex;
      align-items:center;
      justify-content:center;
      height:100vh;
      background:#1a1a1a;
      color:white;
      font-family:Segoe UI;
    ">
      <div style="text-align:center">
        <h1>❌ Pago cancelado</h1>
        <p>No se completó el pago</p>

        <button onclick="location.href='planes.html'" 
        style="
          margin-top:20px;
          padding:12px 20px;
          border:none;
          border-radius:10px;
          background:#ff4b5c;
          color:white;
          font-weight:bold;
          cursor:pointer;
        ">
        Intentar nuevamente
        </button>
      </div>
    </div>
  `;
}

// 🔥 LIMPIAR URL
setTimeout(() => {
  if(status){
    window.history.replaceState({}, document.title, "planes.html");
  }
}, 2000);


/* =========================
   🔥 FUNCIONES UI
========================= */

function mostrarExito(){
  detenerVerificacion();

  document.body.innerHTML = `
    <div style="
      display:flex;
      align-items:center;
      justify-content:center;
      height:100vh;
      background:linear-gradient(135deg,#4a00e0,#8e2de2);
      color:white;
      font-family:Segoe UI;
    ">
      <div style="
        background:rgba(255,255,255,.1);
        padding:40px;
        border-radius:20px;
        text-align:center;
      ">
        <h1>✅ Pago verificado</h1>
        <p>Tu plan fue activado correctamente</p>

        <button onclick="continuar()" 
        style="
          margin-top:20px;
          padding:12px 20px;
          border:none;
          border-radius:10px;
          background:#00c6ff;
          color:white;
          font-weight:bold;
          cursor:pointer;
        ">
        Continuar
        </button>
      </div>
    </div>
  `;

  // 🔥 limpiar pago después de éxito
  localStorage.removeItem("pago_id");
}

function continuar(){
  const id = localStorage.getItem("pago_id");

  if(!id){
    alert("Error: no se encontró el pago");
    return;
  }

  window.location.href = "success.html?payment_id=" + id;
}

function mostrarPendiente(){
  document.body.innerHTML = `
    <div style="
      display:flex;
      align-items:center;
      justify-content:center;
      height:100vh;
      background:#111;
      color:white;
      font-family:Segoe UI;
    ">
      <div style="text-align:center">
        <h1 id="estado">⏳ Pago pendiente</h1>
        <p>Paga tu código en agente o banca móvil</p>
        <p>Se activará automáticamente al pagar</p>

        <button onclick="verificarPagoManual()" 
        style="
          margin-top:15px;
          padding:12px;
          border:none;
          border-radius:10px;
          background:#00c6ff;
          color:white;
          font-weight:bold;
          cursor:pointer;
        ">
        Ya pagué
        </button>

        <button onclick="location.href='planes.html'" 
        style="
          margin-top:10px;
          padding:12px;
          border:none;
          border-radius:10px;
          background:#667eea;
          color:white;
          font-weight:bold;
          cursor:pointer;
        ">
        Volver
        </button>
      </div>
    </div>
  `;

  animarEspera();
}

function animarEspera(){
  let dots = 0;
  setInterval(() => {
    dots = (dots + 1) % 4;
    const el = document.getElementById("estado");
    if(el){
      el.innerText = "⏳ Pago pendiente" + ".".repeat(dots);
    }
  }, 500);
}


/* =========================
   🔥 VERIFICACIÓN
========================= */

async function verificarPago(){

  const id = localStorage.getItem("pago_id");
  if(!id) return;

  try{
    let r = await fetch("https://yapefk.kevintechtutorials.fun/verificar_pago/" + id);
    let data = await r.json();

    if(data.status === "approved"){
      mostrarExito();
    }

  }catch(e){
    console.error("Error verificando pago", e);
  }
}

// 🔥 BOTÓN MANUAL
async function verificarPagoManual(){
  await verificarPago();

  const id = localStorage.getItem("pago_id");
  const r = await fetch("https://yapefk.kevintechtutorials.fun/verificar_pago/" + id);
  const data = await r.json();

  if(data.status !== "approved"){
    alert("Aún no se refleja el pago");
  }
}

function iniciarVerificacion(){
  if(intervalo) return;
  intervalo = setInterval(verificarPago, 5000);
}

function detenerVerificacion(){
  if(intervalo){
    clearInterval(intervalo);
    intervalo = null;
  }
}


/* =========================
   🔥 FUNCIÓN DE PAGO
========================= */

async function pagar(plan, precio){  

  // 🔥 EVITAR DUPLICADOS
  const existente = localStorage.getItem("pago_id");
  if(existente){
    alert("Ya tienes un pago en proceso");
    return;
  }

  const loader = document.getElementById("loader");  
  const text = document.getElementById("loaderText");  

  try{  

    loader.style.display = "flex";  

    text.innerText = "Cargando...";  
    await new Promise(r => setTimeout(r, 2000));  

    text.innerText = "Creando pago...";  
    await new Promise(r => setTimeout(r, 2000));  

    let r = await fetch("https://yapefk.kevintechtutorials.fun/crear_pago", {  
      method:"POST",  
      headers:{  
        "Content-Type":"application/json"  
      },  
      body: JSON.stringify({ plan, precio })  
    });  

    if(!r.ok){
      throw new Error("Error servidor");
    }

    let data = await r.json();  

    if(data.id){

      localStorage.setItem("pago_id", data.id);

      text.innerText = "Redirigiendo...";
      await new Promise(r => setTimeout(r, 1000));

      window.location =
      "https://www.mercadopago.com.pe/checkout/v1/redirect?pref_id=" + data.id;

    }else{
      throw new Error("No se creó el pago");
    }

  }catch(e){
    console.error(e);
    alert("Error al conectar con servidor");
    loader.style.display = "none";
  }
}
