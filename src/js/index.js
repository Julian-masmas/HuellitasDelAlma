// Inicializa Firebase
const db = firebase.database();

// Elementos del DOM
const petsGrid = document.getElementById('petsGrid');
const petModal = document.getElementById('petModal');
const modalPetImage = document.getElementById('modalPetImage');
const modalPetName = document.getElementById('modalPetName');
const modalPetType = document.getElementById('modalPetType');
const modalPetAge = document.getElementById('modalPetAge');
const modalPetVet = document.getElementById('modalPetVet');
const modalPetInfo = document.getElementById('modalPetInfo');
const closeModal = document.getElementById('closeModal');
const adoptBtn = document.getElementById('adoptBtn');
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');
const loadingIndicator = document.getElementById('loadingIndicator');
const noPetsMessage = document.getElementById('noPetsMessage');

// Variable para almacenar la mascota actual en el modal
let currentPet = null;

// Cargar todas las mascotas de todas las veterinarias
function loadAllPets() {
    loadingIndicator.style.display = 'block';
    petsGrid.style.display = 'none';
    noPetsMessage.style.display = 'none';
    
    db.ref('Veterinarias').once('value').then(snapshot => {
        const vets = snapshot.val();
        const allPets = [];
        
        if (vets) {
            Object.keys(vets).forEach(vetId => {
                const vet = vets[vetId];
                const vetName = vet.nombre_veterinaria || 'Veterinaria sin nombre';
                
                if (vet.mascotas) {
                    Object.keys(vet.mascotas).forEach(petId => {
                        const pet = vet.mascotas[petId];
                        allPets.push({
                            id: petId,
                            vetId: vetId,
                            vetName: vetName,
                            ...pet
                        });
                    });
                }
            });
        }
        
        renderPets(allPets);
        
        if (allPets.length === 0) {
            noPetsMessage.style.display = 'block';
        } else {
            petsGrid.style.display = 'grid';
        }
        
        loadingIndicator.style.display = 'none';
    }).catch(error => {
        console.error("Error al cargar mascotas:", error);
        loadingIndicator.style.display = 'none';
        noPetsMessage.style.display = 'block';
        noPetsMessage.innerHTML = '<p>Error al cargar las mascotas. Por favor intenta nuevamente.</p>';
    });
}

// Generar las tarjetas de mascotas
function renderPets(pets) {
    petsGrid.innerHTML = '';
    
    pets.forEach(pet => {
        const petCard = document.createElement('div');
        petCard.className = 'pet-card';
        petCard.innerHTML = `
            <img src="${pet.image || 'https://via.placeholder.com/150'}" alt="${pet.name}" 
                 onerror="this.src='https://via.placeholder.com/150'">
            <h3>${pet.name}</h3>
            <p class="pet-type">${pet.type || 'Sin tipo especificado'}</p>
        `;
        
        petCard.addEventListener('click', () => openModal(pet));
        petsGrid.appendChild(petCard);
    });
}

// Abrir modal con información de la mascota
function openModal(pet) {
    currentPet = pet;
    
    modalPetImage.src = pet.image || 'https://via.placeholder.com/150';
    modalPetImage.alt = pet.name;
    modalPetName.textContent = pet.name;
    modalPetType.textContent = pet.type || 'No especificado';
    modalPetAge.textContent = pet.age || '?';
    modalPetVet.textContent = pet.vetName;
    modalPetInfo.textContent = pet.info || 'No hay información adicional disponible.';
    
    petModal.style.display = 'flex';
}

// Cerrar modal
closeModal.addEventListener('click', () => {
    petModal.style.display = 'none';
    currentPet = null;
});

// Cerrar modal al hacer clic fuera del contenido
petModal.addEventListener('click', (e) => {
    if (e.target === petModal) {
        petModal.style.display = 'none';
        currentPet = null;
    }
});

// Botón de adopción
adoptBtn.addEventListener('click', () => {
    if (currentPet) {
        // Guardar la mascota seleccionada para el proceso de adopción
        localStorage.setItem('selectedPet', JSON.stringify(currentPet));
        window.location.href = "../public/adoption.html";
    }
});

// Mostrar/ocultar menú en móviles
menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('active');
});

// About Us
document.getElementById('about').addEventListener('click', () => {
    alert('Huellitas del Alma es una plataforma dedicada a encontrar hogares amorosos para mascotas necesitadas.');
});

// Cargar las mascotas al iniciar la página
document.addEventListener('DOMContentLoaded', loadAllPets);