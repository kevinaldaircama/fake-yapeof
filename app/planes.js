async function pagar(plan, precio){

try{

let r = await fetch(
"https://yapefk.kevintechtutorials.fun/crear_pago",
{
method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
plan:plan,
precio:precio
})

});

let data = await r.json();

if(data.id){

window.location =
"https://www.mercadopago.com.pe/checkout/v1/redirect?pref_id="
+ data.id;

}else{

alert("Error creando pago");

}

}catch(e){

alert("Error al conectar con servidor");

}

}
