document.addEventListener('DOMContentLoaded', () => {
  const loginBtn = document.getElementById('login_btn');

  loginBtn.addEventListener('click', (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!email || !password) {
      alert('Por favor complete todos los campos');
      return;
    }

    firebase.auth().signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        alert('¡Inicio de sesión exitoso!');
        window.location.href = "admin.html"
        // Redirigir a la página principal de la veterinaria o dashboard
        // Por ejemplo:
        // window.location.href = "dashboardVet.html";
      })
      .catch((error) => {
        console.error("Error al iniciar sesión:", error);
        let errorMessage = "Error al iniciar sesión";
        switch(error.code) {
          case 'auth/user-not-found':
            errorMessage = "No existe una cuenta con este correo";
            break;
          case 'auth/wrong-password':
            errorMessage = "Contraseña incorrecta";
            break;
          case 'auth/invalid-email':
            errorMessage = "Correo inválido";
            break;
        }
        alert(errorMessage);
      });
  });
});
