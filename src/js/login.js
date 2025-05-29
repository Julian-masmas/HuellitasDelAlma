// Configuración de Firebase (la misma que usaste)
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

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const auth = firebase.auth(); // Obtener el servicio de autenticación

document.addEventListener('DOMContentLoaded', () => {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const loginBtn = document.getElementById('login_btn');

    loginBtn.addEventListener('click', (e) => {
        e.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        // Validacion de campos no vacios
        if (!email || !password) {
            errorMessage.textContent = "Por favor, completa todos los campos";
            errorMessage.style.display = "block";
            return;
        }

        // Iniciar sesión con Firebase Authentication
        auth.signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Usuario autenticado con éxito
                const user = userCredential.user;

                // Obtener datos adicionales del usuario desde Realtime Database
                const userRef = firebase.database().ref('Usuarios').orderByChild('email').equalTo(email);

                userRef.once('value', (snapshot) => {
                    const userData = snapshot.val();
                    let userId, userName;

                    // Encontrar el ID del usuario (ya que es un objeto con IDs aleatorios)
                    for (const key in userData) {
                        if (userData[key].email === email) {
                            userId = key;
                            userName = userData[key].nombre_usuario;
                            break;
                        }
                    }

                    // Guardar información del usuario en sessionStorage
                    sessionStorage.setItem('user', JSON.stringify({
                        id: userId,
                        email: user.email,
                        name: userName
                    }));

                    // Redirigir al dashboard o página principal
                    window.location.href = "index.html";
                });
            }).then(() => {
                alert("Inicio de sesion correcto")
            })
            .catch((error) => {
                // Manejar errores
                let errorMessage = "Error al iniciar sesión";

                switch (error.code) {
                    case "auth/invalid-email":
                        errorMessage = "El formato del correo es inválido";
                        break;
                    case "auth/user-disabled":
                        errorMessage = "Este usuario ha sido deshabilitado";
                        break;
                    case "auth/user-not-found":
                        errorMessage = "No existe un usuario con este correo";
                        break;
                    case "auth/wrong-password":
                        errorMessage = "Contraseña incorrecta";
                        break;
                    default:
                        errorMessage = error.message;
                }

                document.getElementById('login-error').textContent = errorMessage;
                document.getElementById('login-error').style.display = "block";
            });
    });
});