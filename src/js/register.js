const {Client}=require('pg');
const con=new Client({
  host: "localhost",
  user: "postgres",
  port: 5432,
  password: "1234567890",
  database: "huellitas_db"
  }
)

con.connect().then(()=> console.log("Conexion exitosa")) 

const userNameInput = document.getElementById('username');
// const emailInput = document.getElementById('email');
// const passwordInput = document.getElementById('password');
// const cellPhoneInput = document.getElementById('cellphone');
// const directionInput = document.getElementById('direccion');
// const register_btn = document.getElementById('register_btn')

// function registrarUsuario(e){
//   e.preventDefault()
 
// }
// function iniciarSesion(){

// }
// register_btn.addEventListener('click', registrarUsuario);

