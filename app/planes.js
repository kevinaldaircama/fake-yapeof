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

// 🔥 LIMPIAR URL (DESPUÉS DE PROCESAR)
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
}

function continuar(){
  const id = localStorage.getItem("pago_id");

  if(!id){
    alert("Error: no se encontró el pago");
    return;
  }

  // 🔥 ENVÍA EL ID A SUCCESS
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
        <h1 id="estado">⏳ Esperando pago...</h1>
        <p>Realiza el pago con tu código de PagoEfectivo</p>
        <p>Esta pantalla se actualizará automáticamente</p>

        <button onclick="location.href='planes.html'" 
        style="
          margin-top:20px;
          padding:12px 20px;
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
      el.innerText = "⏳ Esperando pago" + ".".repeat(dots);
    }
  }, 500);
}


/* =========================
   🔥 VERIFICACIÓN AUTOMÁTICA
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
