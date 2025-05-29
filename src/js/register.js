// import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
// import { getDatabase, ref, push, set } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-database.js";

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

document.addEventListener('DOMContentLoaded', () => {
  const userNameInput = document.getElementById('username');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const cellPhoneInput = document.getElementById('cellphone');
  const directionInput = document.getElementById('direccion');
  const register_btn = document.getElementById('register_btn');

  register_btn.addEventListener('click', (e) => {
    e.preventDefault();

    const usuariosRef = firebase.database().ref('Usuarios');
    const nuevaRef = usuariosRef.push();  // 🔑 Crea ID único

    nuevaRef.set({
      nombre_usuario: userNameInput.value,
      email: emailInput.value,
      password: passwordInput.value,
      celular: cellPhoneInput.value,
      direccion: directionInput.value
    }).then(() => {
      alert("Usuario registrado con ID: " + nuevaRef.key);
    }).catch((error) => {
      console.error("Error al registrar usuario:", error);
    });
  });
});
// document.addEventListener('DOMContentLoaded', () => {
//   const userNameInput = document.getElementById('username');
//   const emailInput = document.getElementById('email');
//   const passwordInput = document.getElementById('password');
//   const cellPhoneInput = document.getElementById('cellphone');
//   const directionInput = document.getElementById('direccion');
//   const register_btn = document.getElementById('register_btn');

//   function registrarUsuario(e) {
//     e.preventDefault();

//     const usuariosRef = ref(db, 'Usuarios');
//     const nuevaRef = push(usuariosRef);  // 🔑 Crea ID único

//     set(nuevaRef, {
//       nombre_usuario: userNameInput.value,
//       email: emailInput.value,
//       password: passwordInput.value,
//       celular: cellPhoneInput.value,
//       direccion: directionInput.value
//     }).then(() => {
//       alert("Usuario registrado con ID: " + nuevaRef.key);
//     }).catch((error) => {
//       console.error("Error al registrar usuario:", error);
//     });
//   }

//   register_btn.addEventListener('click', registrarUsuario);
// });
