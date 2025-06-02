// Datos de ejemplo de mascotas
const pets = [
  { id: 1, name: "Max", image: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZG9nfGVufDB8fDB8fHww", info: "Max es un perro juguetón de 2 años que adora los paseos y jugar con pelotas." },
  { id: 2, name: "Luna", image: "https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y2F0fGVufDB8fDB8fHww", info: "Luna es una gata tranquila de 3 años que disfruta de las siestas al sol." },
  { id: 3, name: "Rocky", image: "https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZG9nfGVufDB8fDB8fHww", info: "Rocky es un perro protector de 4 años, ideal para familias con niños." },
  { id: 4, name: "Milo", image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2F0fGVufDB8fDB8fHww", info: "Milo es un gato curioso de 1 año que siempre está explorando nuevos lugares." },
  { id: 5, name: "Bella", image: "https://images.unsplash.com/photo-1583511655826-05700d52f4d9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8ZG9nfGVufDB8fDB8fHww", info: "Bella es una perrita cariñosa de 5 años que busca un hogar amoroso." },
  { id: 6, name: "Simba", image: "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Y2F0fGVufDB8fDB8fHww", info: "Simba es un gato majestuoso de 2 años con un pelaje espectacular." },
  { id: 7, name: "Coco", image: "https://images.unsplash.com/photo-1544568100-847a948585b9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGRvZ3xlbnwwfHwwfHx8MA%3D%3D", info: "Coco es un perro energético de 1 año que necesita mucho ejercicio." },
  { id: 8, name: "Lola", image: "https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGNhdHxlbnwwfHwwfHx8MA%3D%3D", info: "Lola es una gata mimosa de 4 años que adora que la acaricien." },
  { id: 9, name: "Toby", image: "https://images.unsplash.com/photo-1586671267731-da2cf3ceeb80?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGRvZ3xlbnwwfHwwfHx8MA%3D%3D", info: "Toby es un perro leal de 6 años, perfecto como compañero." }
];

// Elementos del DOM
const petsGrid = document.getElementById('petsGrid');
const petModal = document.getElementById('petModal');
const modalPetImage = document.getElementById('modalPetImage');
const modalPetName = document.getElementById('modalPetName');
const modalPetInfo = document.getElementById('modalPetInfo');
const closeModal = document.getElementById('closeModal');
const adoptBtn = document.getElementById('adoptBtn');
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');

// Generar las tarjetas de mascotas
pets.forEach(pet => {
  const petCard = document.createElement('div');
  petCard.className = 'pet-card';
  petCard.innerHTML = `
                <img src="${pet.image}" alt="${pet.name}">
                <h3>${pet.name}</h3>
            `;
  petCard.addEventListener('click', () => openModal(pet));
  petsGrid.appendChild(petCard);
});

// Abrir modal con información de la mascota
function openModal(pet) {
  modalPetImage.src = pet.image;
  modalPetImage.alt = pet.name;
  modalPetName.textContent = pet.name;
  modalPetInfo.textContent = pet.info;
  petModal.style.display = 'flex';
}

// Cerrar modal
closeModal.addEventListener('click', () => {
  petModal.style.display = 'none';
});

// Cerrar modal al hacer clic fuera del contenido
petModal.addEventListener('click', (e) => {
  if (e.target === petModal) {
    petModal.style.display = 'none';
  }
});

// Botón de adopción
adoptBtn.addEventListener('click', () => {
  petModal.style.display = 'none';
  window.location.href = "../public/adoption.html";
});

// Mostrar/ocultar menú en móviles
menuToggle.addEventListener('click', () => {
  sidebar.classList.toggle('active');
});

// Funcionalidad de los botones del menú
// document.getElementById('register-user').addEventListener('click', () => {
//   alert('Redirigiendo al formulario de registro de usuario');
// });

// document.getElementById('register-vet').addEventListener('click', () => {
//   alert('Redirigiendo al formulario de registro de veterinaria');
// });

// document.getElementById('login').addEventListener('click', () => {
//   alert('Redirigiendo al formulario de inicio de sesión');
// });

document.getElementById('about').addEventListener('click', () => {
  alert('AdoptaPet es una plataforma dedicada a encontrar hogares amorosos para mascotas necesitadas.');
});