function openModal(plan){
  document.getElementById("modalTitle").innerText = plan;
  document.getElementById("modal").style.display = "flex";
}

function closeModal(){
  document.getElementById("modal").style.display = "none";
}