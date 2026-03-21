const cfg = window.firebaseConfig;
firebase.initializeApp(cfg);

const auth = firebase.auth();
const db = firebase.firestore();

let clave = "";
let paso = 1;
let primeraClave = "";
let verificarIntervalo = null;

/* PUNTOS */
function actualizarPuntos(){
  const puntos = document.querySelectorAll(".punto");
  puntos.forEach((p,i)=>{
    p.classList.toggle("activo", i < clave.length);
  });
}

/* AGREGAR */
function agregar(num){
  if(clave.length >= 6) return;

  clave += num;
  actualizarPuntos();

  if(clave.length === 6){

    setTimeout(async ()=>{

      if(paso === 1){
        primeraClave = clave;
        clave = "";
        paso = 2;

        actualizarPuntos();
        document.querySelector(".ingresa").innerText = "Confirma tu clave";
        return;
      }

      if(paso === 2){

        if(clave !== primeraClave){
          alert("Las claves no coinciden ❌");
          clave = "";
          primeraClave = "";
          paso = 1;

          actualizarPuntos();
          document.querySelector(".ingresa").innerText = "Ingresa tu clave Yape";
          return;
        }

        const data = JSON.parse(localStorage.getItem("registro_temp"));

        if(!data){
          alert("Error: datos perdidos");
          return;
        }

        try{

          const res = await auth.createUserWithEmailAndPassword(
            data.correo,
            data.clave
          );

          const user = res.user;

          await user.sendEmailVerification();

          await db.collection("usuarios")
          .doc(user.uid)
          .set({
            nombre: data.nombre,
            correo: data.correo,
            telefono: data.telefono,
            monto: data.monto,
            pin: btoa(clave),
            verificado: false,
            fecha: new Date()
          });

          localStorage.removeItem("registro_temp");

          alert("Te enviamos un correo para verificar tu cuenta 📩");

          verificarCorreo();

        }catch(e){
          alert("Error: " + e.message);
        }

      }

    },200);
  }
}

/* VERIFICAR */
function verificarCorreo(){

  verificarIntervalo = setInterval(async ()=>{

    const user = auth.currentUser;

    if(user){

      await user.reload();

      if(user.emailVerified){

        await db.collection("usuarios")
        .doc(user.uid)
        .update({
          verificado: true
        });

        clearInterval(verificarIntervalo);

        alert("Cuenta verificada correctamente ✅");

        window.location.href = "login";
      }

    }

  },5000);
}

/* BORRAR */
function borrar(){
  clave = clave.slice(0,-1);
  actualizarPuntos();
}
