// Verificar sesión
if (!localStorage.getItem("sessionToken")) {
  location.href = "/";
}

// Obtener parámetros
const params = new URLSearchParams(window.location.search);
const nombre = decodeURIComponent(params.get("nombre") || "Sin nombre");
const telefono = decodeURIComponent(params.get("telefono") || "000000000");
const monto = decodeURIComponent(params.get("monto") || "0");

// Mostrar datos
document.getElementById("nombre").textContent = nombre;
const montoNum = parseFloat(monto);
document.getElementById("monto").textContent =
  montoNum % 1 === 0 ? montoNum : montoNum.toFixed(2);
document.getElementById("telefono").textContent = `*** ***${telefono.slice(-3)}`;

// Fecha y hora
const fechaObj = new Date();
document.querySelector("#fecha span").textContent =
  fechaObj.toLocaleDateString('es-PE', { day:'2-digit', month:'short', year:'numeric' });

document.querySelector("#hora span").textContent =
  fechaObj.toLocaleTimeString('es-PE', { hour:'2-digit', minute:'2-digit', hour12:true });

// Código de seguridad
const codigo = Math.floor(Math.random() * 900 + 100).toString();
const cajas = document.getElementById("codigo-seguridad").children;
for (let i = 0; i < 3; i++) {
  cajas[i].textContent = codigo[i];
}

// 🎉 Confeti
function lanzarConfeti() {
  confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });

  setTimeout(() => {
    confetti({ particleCount: 100, angle: 60, spread: 55, origin: { x: 0 } });
    confetti({ particleCount: 100, angle: 120, spread: 55, origin: { x: 1 } });
  }, 300);
}

lanzarConfeti();

// Número de operación aleatorio
document.getElementById("operacion").textContent =
  Math.floor(10000000 + Math.random() * 90000000);

// Promoción aleatoria
const promociones = [
  "imagen/1.jpg",
  "imagen/kevin2.jpg",
  "imagen/kevin.jpg",
  "imagen/kevin2.jpg",
  "imagen/IMG-20260125-WA0045.jpg",
  "imagen/IMG-20260118-WA0031.jpg"
];

document.getElementById("promo-img").src =
  promociones[Math.floor(Math.random() * promociones.length)];

// 🌟 Compartir comprobante como imagen completa
const btnCompartir = document.getElementById("btnCompartir");
btnCompartir.addEventListener("click", compartir);

async function compartir() {
  const comprobante = document.getElementById("comprobante");

  if (!comprobante) {
    alert("No se encontró el comprobante.");
    return;
  }

  try {
    // Captura todo el comprobante con alta resolución
    const canvas = await html2canvas(comprobante, {
      scale: 3,             // mayor resolución
      useCORS: true,        // permite imágenes externas
      logging: true,
      scrollY: -window.scrollY,
      windowWidth: document.body.scrollWidth,
      windowHeight: document.body.scrollHeight
    });

    const blob = await new Promise(resolve => canvas.toBlob(resolve, "image/png"));

    const file = new File([blob], "comprobante.png", { type: "image/png" });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        title: "Comprobante Yape",
        text: "Te comparto el comprobante.",
        files: [file]
      });
    } else {
      // Descargar automáticamente si no se puede compartir
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "comprobante.png";
      link.click();
    }

  } catch (error) {
    console.error("Error al compartir:", error);
    alert("Error al generar la imagen.");
  }
}
