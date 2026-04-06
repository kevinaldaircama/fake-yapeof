let planSeleccionado = "";
let precioSeleccionado = 0;

/* =========================
   🔥 ABRIR MODAL
========================= */
function pagar(plan, precio){
  planSeleccionado = plan;
  precioSeleccionado = precio;

  document.getElementById("modalPago").style.display = "flex";
}

/* =========================
   🔥 CERRAR MODAL
========================= */
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
<p><b>antento:</b>después de realizar el pago escribeme por Whatsapp aquí 
994031672 o en la sección de ayuda</p>
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

      <h2 class="title">PagoEfectivo</h2>

      <img 
      src="https://roddox.es/imagen/efectivo.jpg"
      class="qr">

      <div class="info-box">
        <p><b>Número:</b> 994031672</p>
        <p><b>Nombre:</b> luz veronica</p>
        <p><b>Destino:</b> dale</p>
        <p><b>descripción:</b> Hola mi nombre es; y mi número de WhatsApp es: envié el token por Whatsapp</p>
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
   ✅ MENSAJE FINAL
========================= */
function confirmarPago(){
  document.body.innerHTML = `
  <div class="center-screen success-bg">

    <div class="card">

      <i class="fa-solid fa-circle-check icon-big success-icon"></i>

      <h2 class="title">Solicitud enviada</h2>

      <p class="subtitle">
        Estimado usuario, comunícate conmigo mediante el botón de ayuda
      </p>

      <button onclick="location.href='planes'" class="btn-pro">
        Volver
      </button>

    </div>

  </div>
  `;
}
