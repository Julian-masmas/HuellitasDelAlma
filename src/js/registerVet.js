const firebaseConfig = {
  apiKey: "AIzaSyAQgYiQo-qzBkr7jFBUUORr01ImBX-SIk8",
  authDomain: "huellitasdelalma-60cfb.firebaseapp.com",
  databaseURL: "https://huellitasdelalma-60cfb-default-rtdb.firebaseio.com",
  projectId: "huellitasdelalma-60cfb",
  storageBucket: "huellitasdelalma-60cfb.firebasestorage.app",
  messagingSenderId: "1010111418840",
  appId: "1:1010111418840:web:33efac312ca4dd6de022ad",
  measurementId: "G-NV6YYVFJS3"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const auth = firebase.auth(); 

document.addEventListener('DOMContentLoaded', () => {
  const userNameInput = document.getElementById('username');
  const emailInput = document.getElementById('email');
  const nitInput = document.getElementById('nit');
  const passwordInput = document.getElementById('password');
  const cellPhoneInput = document.getElementById('cellphone');
  const directionInput = document.getElementById('direccion');
  const register_btn = document.getElementById('register_btn');

  register_btn.addEventListener('click', (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const nombre = userNameInput.value.trim();
    const celular = cellPhoneInput.value.trim();
    const direccion = directionInput.value.trim();
    const nit = nitInput.value.trim();

    // ✅ Primero registrar en Firebase Authentication
    auth.createUserWithEmailAndPassword(email, password)
      .then((vetCredential) => {
        const vet = vetCredential.user;

        // ✅ Luego guardar datos adicionales en Realtime Database
        return db.ref("Veterinarias/" + vet.uid).set({
          nombre_veterinaria: nombre,
          email: email,
          celular: celular,
          direccion: direccion,
          nit: nit
        });
      })
      .then(() => {
        alert("Veterinaria registrada correctamente.");
      })
      .catch((error) => {
        console.error("Error al registrar veterinaria:", error);
        alert("Error: " + error.message);
      });
  });
});
