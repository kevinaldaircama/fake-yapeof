function calcularEaster(year) {
  let a = year % 19;
  let b = Math.floor(year / 100);
  let c = year % 100;
  let d = Math.floor(b / 4);
  let e = b % 4;
  let f = Math.floor((b + 8) / 25);
  let g = Math.floor((b - f + 1) / 3);
  let h = (19 * a + b - d - g + 15) % 30;
  let i = Math.floor(c / 4);
  let k = c % 4;
  let l = (32 + 2 * e + 2 * i - h - k) % 7;
  let m = Math.floor((a + 11 * h + 22 * l) / 451);
  let month = Math.floor((h + l - 7 * m + 114) / 31);
  let day = ((h + l - 7 * m + 114) % 31) + 1;

  return new Date(year, month - 1, day);
}
function semanaSanta(year) {
  const easter = calcularEaster(year);

  const jueves = new Date(easter);
  jueves.setDate(easter.getDate() - 3);

  const viernes = new Date(easter);
  viernes.setDate(easter.getDate() - 2);

  return [
    { nombre: "Jueves Santo ✝️", fecha: jueves },
    { nombre: "Viernes Santo ✝️", fecha: viernes }
  ];
}
function obtenerEventos() {
  const year = new Date().getFullYear();

  const diaMadre = new Date(year, 4, 1 + (7 - new Date(year,4,1).getDay()) + 7);
  const diaPadre = new Date(year, 5, 1 + (7 - new Date(year,5,1).getDay()) + 14);

  return [
    { nombre: "Feliz día del san Valentín 💖", fecha: new Date(year, 1, 14) },

    ...semanaSanta(year),

    { nombre: " Feliz día del Trabajo 👷", fecha: new Date(year, 4, 1) },

    { nombre: "Feliz día de la Madre 👩‍👧", fecha: diaMadre },

    { nombre: "Feliz día del Padre 👨‍👧", fecha: diaPadre },

    { nombre: "Felices fiestas Patrias 🇵🇪", fecha: new Date(year, 6, 28) },
    { nombre: "Felices fiestas Patrias 🇵🇪", fecha: new Date(year, 6, 29) },

    { nombre: "Feliz Navidad 🎄", fecha: new Date(year, 11, 25) }
  ];
}
/* =========================
   🧠 DETECTAR SEMANA PROMO
========================= */
function eventoActivo() {
  const hoy = new Date();

  return obtenerEventos().find(e => {
    const diff = (e.fecha - hoy) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 7;
  });
}

/* =========================
   💸 CALCULAR PRECIO
========================= */
function aplicarDescuento(precio) {
  return eventoActivo()
    ? Math.round(precio * 0.9)
    : precio;
}

/* =========================
   🏷️ ACTUALIZAR PRECIOS UI
========================= */
function actualizarPrecios() {
  const evento = eventoActivo();

  document.querySelectorAll(".price").forEach(el => {
    const precio = parseInt(el.dataset.precio);
    const nuevo = aplicarDescuento(precio);

    if (evento) {
      el.innerHTML = `
        <span class="old">S/ ${precio}</span>
        <span class="new">S/ ${nuevo}</span>
        <span class="sale">-10%</span>
      `;
    } else {
      el.innerHTML = `S/ ${precio}`;
    }
  });
}

/* =========================
   🎊 MODAL PROMOCIÓN
========================= */
function mostrarPromo(){
  const evento = eventoActivo();
  if (!evento) return;

  const modal = document.createElement("div");

  modal.innerHTML = `
    <div style="
      position:fixed;
      inset:0;
      background:rgba(0,0,0,.7);
      display:flex;
      align-items:center;
      justify-content:center;
      z-index:99999;
    ">
      <div style="
        background:linear-gradient(135deg,#667eea,#764ba2);
        color:white;
        padding:25px;
        border-radius:20px;
        text-align:center;
        max-width:320px;
      ">
        <h2>${evento.nombre}</h2>
        <p>🎉 aprovecha este 10% de descuento hasta terminar la promoción</p>

        <button onclick="this.closest('div').parentElement.remove()"
        style="
          margin-top:12px;
          padding:10px 15px;
          border:none;
          background:white;
          color:#667eea;
          border-radius:10px;
          font-weight:bold;
        ">
          Aceptar promoción 🚀
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
}
/* =========================
   🚀 INICIO
========================= */
window.addEventListener("load", () => {
  actualizarPrecios();

  if (eventoActivo()) {
    setTimeout(mostrarPromo, 1200);
  }
});
/* =========================
   💳 LÓGICA DE PAGO
========================= */
let planSeleccionado = "";
let precioSeleccionado = 0;

function pagar(plan, precio){
  planSeleccionado = plan;

  const precioFinal = aplicarDescuento(precio);
  precioSeleccionado = precioFinal;

  document.getElementById("modalPago").style.display = "flex";
}

function cerrarModal(){
  document.getElementById("modalPago").style.display = "none";
}

/* =========================
   💳 MERCADO PAGO
========================= */
function pagarMP(){
  cerrarModal();

  document.body.innerHTML = `
  <div class="center-screen mp-bg">

    <div class="card">
      <i class="fa-solid fa-credit-card icon-big"></i>

      <h1 class="title">Mercado Pago</h1>
      <p class="subtitle">Pago seguro</p>

      <p><b>${planSeleccionado}</b></p>
      <p class="price-text">S/ ${precioSeleccionado}</p>

      <p><b>Atento:</b> después de pagar escríbeme por WhatsApp o ayuda</p>

      <button onclick="irMP()" class="btn-pro btn-mp">
        Ir a pagar
      </button>
    </div>

  </div>
  `;
}

function irMP(){
  window.location.href = "https://link.mercadopago.com.pe/kevintechtutorials";
}

/* =========================
   💵 PAGO EFECTIVO
========================= */
function pagoEfectivo(){
  cerrarModal();

  document.body.innerHTML = `
  <div class="center-screen">

    <div class="card">

      <h2 class="title">Yape</h2>

      <img src="imagen/efectivo.png" class="qr">

      <div class="info-box">
        <p><b>Número:</b> 994031672</p>
        <p><b>Nombre:</b> luz Serna</p>
        <p><b>Destino:</b> yape/dale</p>
      </div>

      <h3 class="price-text">S/ ${precioSeleccionado}</h3>

      <button onclick="formularioPago()" class="btn-pro btn-success">
        Ya pagué
      </button>

    </div>

  </div>
  `;
}

/* =========================
   📝 FORMULARIO
========================= */
function formularioPago(){
  document.body.innerHTML = `
  <div class="center-screen dark-bg">

    <div class="card card-dark">

      <h2 class="title">Confirmar Pago</h2>

      <input id="nombre" class="input-pro" placeholder="Nombre del pago">
      <input id="hora" class="input-pro" placeholder="Hora del pago">
      <input id="id" class="input-pro" placeholder="ID operación">

      <button onclick="confirmarPago()" class="btn-pro btn-success">
        Confirmar pago
      </button>

    </div>

  </div>
  `;
}

/* =========================
   ✅ FINAL
========================= */
function confirmarPago(){
  document.body.innerHTML = `
  <div class="center-screen success-bg">

    <div class="card">

      <h2 class="title">Solicitud enviada</h2>
      <p class="subtitle">Contáctame por ayuda</p>

      <button onclick="location.href='planes'" class="btn-pro">
        Volver
      </button>

    </div>

  </div>
  `;
}
