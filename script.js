const buttons = document.querySelectorAll(".btn-recarga");
const checkout = document.getElementById("checkout");
const productsContainer = document.getElementById("products-container");
const inputGame = document.getElementById("game");
const cancelBtn = document.getElementById("btn-cancel");
const checkoutForm = document.getElementById("checkout-form");

// ⚠️ REEMPLAZA ESTA URL CON LA URL DE TU GOOGLE APPS SCRIPT
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzKHjV2322hPRRSJXV4iLV2UeReNWJXhIgdOXQ800QPR_Xh-EQkakXyHhFw0JS5qei8og/exec";


//agregarndo funcion para bs para cada juego
function extractAmount() {
  const game = document.getElementById("game").value;
  let selectElement;

  // 🆕 DETECTAR QUÉ SELECT USAR SEGÚN EL JUEGO
  if (game === "Free Fire") {
    selectElement = document.getElementById("ff-product");
  } else if (game === "Roblox") {
    selectElement = document.getElementById("roblox-product");
  } else if (game === "Mobile Legends") {
    selectElement = document.getElementById("ml-product");
  }

  // Si no hay select o no hay opción seleccionada
  if (!selectElement || selectElement.selectedIndex === 0) {
    return "0";
  }

  const selectedOption = selectElement.options[selectElement.selectedIndex];
  const fullText = selectedOption.textContent;
  match = fullText.match(/- Bs (\d+(\.\d+)?)/);
  return match ? match[1] : "0";
}
//termina lo agregado para bs para cada juego


//eliminado por la funcion de botones con los nuevos precios
buttons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const game = btn.getAttribute("data-game");
    inputGame.value = game;

    // 🆕 OCULTAR TODOS LOS BLOQUES PRIMERO
    document.getElementById("form-freefire").style.display = "none";
    document.getElementById("form-roblox").style.display = "none";
    document.getElementById("form-ml").style.display = "none";

    // 🆕 MOSTRAR SOLO EL BLOQUE DEL JUEGO SELECCIONADO
    if (game === "Free Fire") { //esto viene de datagame con lo que esta vinculado
      document.getElementById("form-freefire").style.display = "block";
    } else if (game === "Roblox") { //esto viene de datagame con lo que esta vinculado
      document.getElementById("form-roblox").style.display = "block";
    } else if (game === "Mobile Legends") { //esto viene de datagame con lo que esta vinculado
      document.getElementById("form-ml").style.display = "block";
    }

    checkout.style.display = "block";
    productsContainer.style.display = "none";
    window.scrollTo(0, 0);
  });
});
//eliminado por la nueva funcion fin

cancelBtn.addEventListener("click", () => {
  checkout.style.display = "none";
  productsContainer.style.display = "grid";
  checkoutForm.reset();
  // 🆕 OCULTAR TODOS LOS BLOQUES AL CANCELAR NUEVO AGREGADO
  document.getElementById("form-freefire").style.display = "none";
  document.getElementById("form-roblox").style.display = "none";
  document.getElementById("form-ml").style.display = "none";
  //🆕NUEVO AGREGADO FIN
});

// Función para convertir archivo a Base64 esto es lo nuevo agregado
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

checkoutForm.addEventListener("submit", async (e) => { //funciones complejas de implementacion code
  e.preventDefault();
  // 🆕 CÓDIGO NUEVO QUE AGREGAS AQUÍ (validación)
  const game = checkoutForm.game.value;

  if (game === "Free Fire") {
    const userId = document.getElementById("ff-userId").value;
    const username = document.getElementById("ff-username").value;
    const product = document.getElementById("ff-product").value;
    if (!userId || !username || !product) {
      alert("⚠️ Por favor completa todos los campos de Free Fire");
      return;
    }
  } else if (game === "Roblox") {
    const username = document.getElementById("roblox-username").value;
    const password = document.getElementById("roblox-password").value;
    const robloxNick = document.getElementById("roblox-nick").value;
    const product = document.getElementById("roblox-product").value;
    if (!username || !password || !robloxNick || !product) {
      alert("⚠️ Por favor completa todos los campos de Roblox");
      return;
    }
  } else if (game === "Mobile Legends") {
    const userId = document.getElementById("ml-userId").value;
    const zone = document.getElementById("ml-zone").value;
    const mlUsername = document.getElementById("ml-username").value;
    const product = document.getElementById("ml-product").value;
    if (!userId || !zone || !mlUsername || !product) {
      alert("⚠️ Por favor completa todos los campos de Mobile Legends");
      return;
    }
  }
  // 🆕 FIN DEL CÓDIGO NUEVO


  const submitBtn = e.target.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.textContent = "Procesando...";
  // Preparar los datos CON EL COMPROBANTE
  const voucherFile = checkoutForm.voucher.files[0];
  let voucherBase64 = null;


  // Si hay un archivo, convertirlo a Base64
  if (voucherFile) {
    voucherBase64 = await fileToBase64(voucherFile);
  }



  //eliminamos el envio por todo los juegos
  // 🆕 CAPTURAR DATOS SEGÚN EL JUEGO SELECCIONADO
  let userId, product;

  if (game === "Free Fire") {
    userId = document.getElementById("ff-userId").value;
    playerUsername = document.getElementById("ff-username").value;
    product = document.getElementById("ff-product").value;

  } else if (game === "Roblox") {
   const username = document.getElementById("roblox-username").value;
   const password = document.getElementById("roblox-password").value;
    userId = username + " (contraseña: " + password + ")";
    playerUsername = document.getElementById("roblox-nick").value;
    product = document.getElementById("roblox-product").value;
  

  } else if (game === "Mobile Legends") {
    const mlUserId = document.getElementById("ml-userId").value;
    const mlZone = document.getElementById("ml-zone").value;
    userId = mlUserId + " (Zona: " + mlZone + ")";
    playerUsername = document.getElementById("ml-username").value;
    product = document.getElementById("ml-product").value;
  }

  const formData = {
    game: game,
    userId: userId,
    playerUsername: playerUsername,   // ← campo separado para el Nick
    product: product,
    payment: checkoutForm.payment.value, //tipo de pago
    amount: extractAmount(), //bs
    voucher: voucherBase64, //comprobante
    customerPhone: "591" + checkoutForm.customerPhone.value //numero de telefono nuevo
  };
  //eliminamos el envio pro todo los juegos fin

  // Enviar datos a Google Sheets
  try {

    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors', // Importante para Google Apps Script
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    });
    //NEW DATO PARA ELABORACION DEL NUEVO CODIGO QUE S PARA WASSAPT AUTOMATICO PRUEBA UNO
    const mesajeWhatsApp = `
    ✅ *Compra registrada exitosamente*
    
    🎮 Juego: ${formData.game}
    🆔 ID Usuario: ${formData.userId}
    👤 Nick: ${formData.playerUsername || "N/A"}
    📦 Producto: ${formData.product}
    💰 Monto: Bs ${formData.amount}
    💳 Pago: ${formData.payment}

    Presiona ENVIAR para recibir notificacion de su pedido
    `;
    const numeroAdmin = "59177199978"; // el nuemero del admin PARA HACER PRUEBA SIUUUU
    //const urlWhatsApp =
    // ✨ USAR PROTOCOLO whatsapp:// PARA ABRIR LA APP DIRECTAMENTE NUEVOOOOOO
    const urlWhatsApp = `https://wa.me/${numeroAdmin}?text=${encodeURIComponent(mesajeWhatsApp)}`;
    window.location.href = urlWhatsApp;
    //Resetear formulario
    checkout.style.display = "none";
    productsContainer.style.display = "grid";
    checkoutForm.reset();


  } catch (error) {
    console.error('Error:', error);
    alert("❌ Hubo un error al procesar tu compra. Por favor intenta nuevamente.");
  } finally {
    //Rehabilitar el botón
    submitBtn.disabled = false;
    submitBtn.textContent = "Finalizar Compra";
  }


});
