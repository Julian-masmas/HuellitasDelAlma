const db = firebase.database();
const auth = firebase.auth();

document.addEventListener('DOMContentLoaded', () => {
  const registerBtn = document.getElementById('register_btn');

  registerBtn.addEventListener('click', (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const nombre = document.getElementById('username').value.trim();
    const celular = document.getElementById('cellphone').value.trim();
    const direccion = document.getElementById('direccion').value.trim();
    const nit = document.getElementById('nit').value.trim();

    if (!email || !password || !nombre || !celular || !direccion || !nit) {
      alert('Por favor complete todos los campos');
      return;
    }

    if (password.length < 8) {
      alert('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    auth.createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        return db.ref(`Veterinarias/${user.uid}`).set({
          nombre_veterinaria: nombre,
          email: email,
          celular: celular,
          direccion: direccion,
          nit: nit,
          fecha_registro: new Date().toISOString()
        });
      })
      .then(() => {
        alert('Registro exitoso!');
        document.getElementById('registroForm').reset();
      })
      .catch((error) => {
        console.error("Error en registro:", error);
        let errorMessage = "Error al registrar";

        switch(error.code) {
          case 'auth/email-already-in-use':
            errorMessage = "El correo ya está registrado";
            break;
          case 'auth/invalid-email':
            errorMessage = "Correo electrónico inválido";
            break;
          case 'auth/weak-password':
            errorMessage = "La contraseña es muy débil";
            break;
        }

        alert(errorMessage);
      });
  });
});
