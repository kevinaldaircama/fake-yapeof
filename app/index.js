/* MODAL */

const welcomeModal =
  document.getElementById("welcomeModal");

const countdownEl =
  document.getElementById("countdown");

const closeBtn =
  document.getElementById("closeModal");

let timeLeft = 10;

const timer = setInterval(() => {

  timeLeft--;

  countdownEl.textContent = timeLeft;

  if (timeLeft <= 0) {

    clearInterval(timer);

    countdownEl.style.display = "none";

    closeBtn.style.display = "block";

  }

}, 1000);


closeBtn.addEventListener("click", () => {

  welcomeModal.style.display = "none";

});



/* FIREBASE v10 */

import { initializeApp }
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";

import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup
}
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";


let app;
let auth;


/* INICIALIZAR CON firebase.json */

const cfg = window.firebaseConfig;

app = initializeApp(cfg);
auth = getAuth(app);

startApp();


/* START */

function startApp(){

  const provider =
    new GoogleAuthProvider();

  document
  .getElementById("googleLogin")
  .addEventListener("click", async () => {

    try {

      const result =
        await signInWithPopup(auth, provider);

      const user = result.user;

      alert(
        "Bienvenido " +
        (user.displayName || "")
      );

      location.href = "home";

    }
    catch (error) {

      alert(error.message);

    }

  });

}



/* SLIDER */

const slides =
  document.querySelectorAll(".slide");

const dots =
  document.querySelectorAll(".dot");

let current = 0;


function showSlide(index){

  slides.forEach(s =>
    s.classList.remove("active")
  );

  dots.forEach(d =>
    d.classList.remove("active")
  );

  slides[index].classList.add("active");

  dots[index].classList.add("active");

}


function nextSlide(){

  current =
    (current + 1) % slides.length;

  showSlide(current);

}


setInterval(nextSlide, 3000);


dots.forEach((dot, index) => {

  dot.addEventListener("click", () => {

    current = index;

    showSlide(current);

  });

});