let pets = [
    { id: 1, name: "Max", image: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZG9nfGVufDB8fDB8fHww", type: "perro", age: 2, info: "Max es un perro juguetón de 2 años que adora los paseos y jugar con pelotas." },
    { id: 2, name: "Luna", image: "https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y2F0fGVufDB8fDB8fHww", type: "gato", age: 3, info: "Luna es una gata tranquila de 3 años que disfruta de las siestas al sol." },
    { id: 3, name: "Rocky", image: "https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZG9nfGVufDB8fDB8fHww", type: "perro", age: 4, info: "Rocky es un perro protector de 4 años, ideal para familias con niños." },
    { id: 4, name: "Milo", image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2F0fGVufDB8fDB8fHww", type: "gato", age: 1, info: "Milo es un gato curioso de 1 año que siempre está explorando nuevos lugares." },
    { id: 5, name: "Bella", image: "https://images.unsplash.com/photo-1583511655826-05700d52f4d9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8ZG9nfGVufDB8fDB8fHww", type: "perro", age: 5, info: "Bella es una perrita cariñosa de 5 años que busca un hogar amoroso." },
    { id: 6, name: "Simba", image: "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Y2F0fGVufDB8fDB8fHww", type: "gato", age: 2, info: "Simba es un gato majestuoso de 2 años con un pelaje espectacular." },
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
const editPetBtn = document.getElementById('editPet');
const deletePetBtn = document.getElementById('deletePet');
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');
const addPetSection = document.getElementById('addPetSection');
const newPetForm = document.getElementById('newPetForm');
const cancelAddPet = document.getElementById('cancelAddPet');
const addPetBtn = document.getElementById('add-pet');
const dashboardBtn = document.getElementById('dashboard');
let currentPetId = null;

// Generar las tarjetas de mascotas
function renderPets() {
    petsGrid.innerHTML = '';
    pets.forEach(pet => {
        const petCard = document.createElement('div');
        petCard.className = 'pet-card';
        petCard.innerHTML = `
                    <img src="${pet.image}" alt="${pet.name}">
                    <h3>${pet.name}</h3>
                    <button class="delete-pet" data-id="${pet.id}">×</button>
                `;
        petCard.addEventListener('click', (e) => {
            // Evitar que se abra el modal si se hizo clic en el botón de eliminar
            if (!e.target.classList.contains('delete-pet')) {
                openModal(pet);
            }
        });

        // Agregar evento al botón de eliminar en la tarjeta
        const deleteBtn = petCard.querySelector('.delete-pet');
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (confirm(`¿Estás seguro de que quieres eliminar a ${pet.name}?`)) {
                deletePet(pet.id);
            }
        });

        petsGrid.appendChild(petCard);
    });
}

// Inicializar la vista
renderPets();

// Abrir modal con información de la mascota
function openModal(pet) {
    currentPetId = pet.id;
    modalPetImage.src = pet.image;
    modalPetImage.alt = pet.name;
    modalPetName.textContent = pet.name;
    modalPetInfo.textContent = pet.info;
    petModal.style.display = 'flex';
}

// Cerrar modal
closeModal.addEventListener('click', () => {
    petModal.style.display = 'none';
    currentPetId = null;
});

// Cerrar modal al hacer clic fuera del contenido
petModal.addEventListener('click', (e) => {
    if (e.target === petModal) {
        petModal.style.display = 'none';
        currentPetId = null;
    }
});

// Botón de editar mascota
editPetBtn.addEventListener('click', () => {
    const pet = pets.find(p => p.id === currentPetId);
    if (pet) {
        // Llenar el formulario con los datos de la mascota
        document.getElementById('petName').value = pet.name;
        document.getElementById('petImage').value = pet.image;
        document.getElementById('petType').value = pet.type;
        document.getElementById('petAge').value = pet.age;
        document.getElementById('petInfo').value = pet.info;

        // Mostrar el formulario
        addPetSection.classList.add('show-add-pet');
        petsGrid.style.display = 'none';
        document.querySelector('.page-title').textContent = 'Editar Mascota';

        // Cerrar el modal
        petModal.style.display = 'none';
        currentPetId = null;
    }
});

// Botón de eliminar mascota
deletePetBtn.addEventListener('click', () => {
    if (currentPetId && confirm('¿Estás seguro de que quieres eliminar esta mascota?')) {
        deletePet(currentPetId);
        petModal.style.display = 'none';
        currentPetId = null;
    }
});

// Función para eliminar mascota
function deletePet(id) {
    pets = pets.filter(pet => pet.id !== id);
    renderPets();
    alert('Mascota eliminada correctamente');
}

// Mostrar/ocultar menú en móviles
menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('active');
});

// Botón para agregar nueva mascota
addPetBtn.addEventListener('click', () => {
    addPetSection.classList.add('show-add-pet');
    petsGrid.style.display = 'none';
    document.querySelector('.page-title').textContent = 'Agregar Nueva Mascota';

    // Limpiar el formulario
    newPetForm.reset();
    currentPetId = null;
});

// Botón para volver al dashboard
dashboardBtn.addEventListener('click', () => {
    addPetSection.classList.remove('show-add-pet');
    petsGrid.style.display = 'grid';
    document.querySelector('.page-title').textContent = 'Mascotas en Adopción';
});

// Cancelar agregar/editar mascota
cancelAddPet.addEventListener('click', () => {
    addPetSection.classList.remove('show-add-pet');
    petsGrid.style.display = 'grid';
    document.querySelector('.page-title').textContent = 'Mascotas en Adopción';
});

// Formulario para agregar/editar mascota
newPetForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const petData = {
        name: document.getElementById('petName').value,
        image: document.getElementById('petImage').value,
        type: document.getElementById('petType').value,
        age: parseInt(document.getElementById('petAge').value),
        info: document.getElementById('petInfo').value
    };

    if (currentPetId) {
        // Editar mascota existente
        const index = pets.findIndex(p => p.id === currentPetId);
        if (index !== -1) {
            pets[index] = { ...pets[index], ...petData };
            alert('Mascota actualizada correctamente');
        }
    } else {
        // Agregar nueva mascota
        const newId = pets.length > 0 ? Math.max(...pets.map(p => p.id)) + 1 : 1;
        pets.push({ id: newId, ...petData });
        alert('Mascota agregada correctamente');
    }

    // Actualizar la vista
    renderPets();
    addPetSection.classList.remove('show-add-pet');
    petsGrid.style.display = 'grid';
    document.querySelector('.page-title').textContent = 'Mascotas en Adopción';
    newPetForm.reset();
    currentPetId = null;
});

// Funcionalidad de otros botones del menú
document.getElementById('manage-pets').addEventListener('click', () => {
    alert('Mostrando gestión de mascotas');
});

document.getElementById('manage-users').addEventListener('click', () => {
    alert('Mostrando gestión de usuarios');
});

document.getElementById('logout').addEventListener('click', () => {
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
        alert('Sesión cerrada. Redirigiendo al inicio...');
        // Aquí iría la redirección a la página de inicio
    }
});