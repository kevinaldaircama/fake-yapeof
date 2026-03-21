if (!localStorage.getItem("sessionToken")) {
  location.href = "/";
}

import { initializeApp }
from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";

import {
  getAuth,
  onAuthStateChanged
}
from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

import {
  getFirestore,
  doc,
  getDoc
}
from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

import {
  getDatabase,
  ref,
  onValue
}
from "https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js";


/* VARIABLES */

let app;
let auth;
let db;
let rtdb;


/* CONFIG */

const cfg = window.firebaseConfig;

app = initializeApp(cfg);

auth = getAuth(app);

db = getFirestore(app);

rtdb = getDatabase(app);

startApp();



function startApp(){

const input =
  document.getElementById("clave");

const dots =
  document.querySelectorAll(".dot");

const keypad =
  document.getElementById("keypad");

const modal =
  document.getElementById("modal");

const modalText =
  document.getElementById("modal-text");

const maintenanceScreen =
  document.getElementById("maintenanceScreen");



function updateDots(){

  dots.forEach((d,i)=>
    d.classList.toggle(
      "active",
      i < input.value.length
    )
  );

}


window.addNumber = function(n){

  if(input.value.length < 6){

    input.value += n;

    updateDots();

    if(input.value.length === 6){
      verificarPIN();
    }

  }

}


window.deleteNumber = function(){

  input.value =
    input.value.slice(0,-1);

  updateDots();

}


function shuffle(a){

  for(
    let i=a.length-1;
    i>0;
    i--
  ){

    const j =
      Math.floor(
        Math.random()*(i+1)
      );

    [a[i],a[j]] =
      [a[j],a[i]];

  }

  return a;

}


function generateKeypad(){

  keypad.innerHTML="";

  const nums =
    shuffle([0,1,2,3,4,5,6,7,8,9]);

  const layout = [
    ...nums.slice(0,9),
    "finger",
    nums[9],
    "del"
  ];

  layout.forEach(item=>{

    const b =
      document.createElement("button");

    if(typeof item==="number"){

      b.textContent=item;

      b.onclick=
        ()=>addNumber(item);

    }
    else if(item==="del"){

      b.innerHTML=
        '<i class="fa-solid fa-delete-left"></i>';

      b.onclick=deleteNumber;

    }
    else{

      b.innerHTML=
        '<i class="fa-solid fa-fingerprint"></i>';

      b.onclick=()=>{
        alert("Huella no disponibles en este dispositivo");
      };

    }

    keypad.appendChild(b);

  });

}



async function verificarPIN(){

  modal.style.display="flex";

  modalText.textContent="Verificando...";

  onAuthStateChanged(
    auth,
    async user=>{

    if(!user){

      modalText.textContent =
        "usted no a iniciado sección, para mas información visite la opción de ayuda";

      return;

    }

    const snap =
      await getDoc(
        doc(
          db,
          "usuarios",
          user.uid
        )
      );

    if(
      snap.exists() &&
      input.value ===
      snap.data().pin
    ){

      location.href="home";

    }
    else{

      modalText.textContent =
        "el pin que ingreso es incorrecto vuelva a verificar.";

      input.value="";

      updateDots();

      generateKeypad();

    }

  });

}


generateKeypad();



/* MANTENIMIENTO */

const maintenanceRef =
  ref(
    rtdb,
    "config/maintenance/enabled"
  );

onValue(
  maintenanceRef,
  snap=>{

  const state =
    snap.exists() &&
    snap.val() === true;

  if(state){

    maintenanceScreen
    .style.display="flex";

    document.body
    .style.overflow="hidden";

  }
  else{

    maintenanceScreen
    .style.display="none";

    document.body
    .style.overflow="";

  }

});

}