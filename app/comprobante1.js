const btnCompartir = document.getElementById("btnCompartir");

btnCompartir.addEventListener("click", async () => {
  const comprobante = document.getElementById("comprobante");
  if (!comprobante) return alert("No se encontró el comprobante.");

  try {
    const canvas = await html2canvas(comprobante, {
      scale: 3,
      useCORS: true,
      allowTaint: true,
      logging: true,
      scrollY: -window.scrollY
    });

    canvas.toBlob(async (blob) => {
      if (!blob) return alert("Error al generar la imagen.");
      const file = new File([blob], "comprobante.png", { type: "image/png" });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            title: "Comprobante Yape",
            text: "Te comparto mi comprobante",
            files: [file]
          });
        } catch (err) {
          console.error("Error al compartir:", err);
          alert("No se pudo compartir, descargando...");
          descargar(blob);
        }
      } else {
        // Descarga como fallback
        descargar(blob);
      }
    }, "image/png");

  } catch (err) {
    console.error("Error html2canvas:", err);
    alert("No se pudo generar la imagen del comprobante.");
  }
});

function descargar(blob) {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "comprobante.png";
  link.click();
  URL.revokeObjectURL(link.href);
}
