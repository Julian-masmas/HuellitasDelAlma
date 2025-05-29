// index.js
import { db, ref, set, get, child } from './firebase-config.js';

// Escribir datos
async function escribirDatos() {
  await set(ref(db, 'usuarios/usuario1'), {
    nombre: 'Julian',
    edad: 25
  });
  console.log('Datos guardados');
}

// Leer datos
async function leerDatos() {
  const dbRef = ref(db);
  const snapshot = await get(child(dbRef, 'usuarios/usuario1'));
  if (snapshot.exists()) {
    console.log(snapshot.val());
  } else {
    console.log("No se encontraron datos");
  }
}

// Ejecutar funciones
await escribirDatos();
await leerDatos();
