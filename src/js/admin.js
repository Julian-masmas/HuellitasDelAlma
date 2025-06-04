document.addEventListener('DOMContentLoaded', () => {
  const newPetForm = document.getElementById('newPetForm');
  const addPetSection = document.getElementById('addPetSection');
  const petsGrid = document.getElementById('petsGrid');
  const editPetBtn = document.getElementById('editPetBtn');
  const petModal = document.getElementById('petModal');

  if (!newPetForm || !addPetSection || !petsGrid) {
    console.error("Faltan elementos clave en el HTML");
    return;
  }

  const db = firebase.database();
  const auth = firebase.auth();

  let currentVetId = null;
  let currentPetId = null;
  let pets = [];

  const getVetRef = () => db.ref(`Veterinarias/${currentVetId}`);
  const getPetsRef = () => db.ref(`Veterinarias/${currentVetId}/mascotas`);

  auth.onAuthStateChanged(user => {
    if (user) {
      currentVetId = user.uid;
      loadPets();
    } else {
      window.location.href = 'login.html';
    }
  });

  function loadPets() {
    getPetsRef().on('value', (snapshot) => {
      pets = [];
      const petsData = snapshot.val();
      if (petsData) {
        Object.keys(petsData).forEach(key => {
          pets.push({ id: key, ...petsData[key] });
        });
      }
      renderPets();
    });
  }

  async function savePet(petData) {
    try {
      if (currentPetId) {
        await getPetsRef().child(currentPetId).update(petData);
        alert('Mascota actualizada correctamente');
      } else {
        const newPetRef = getPetsRef().push();
        await newPetRef.set(petData);
        alert('Mascota agregada correctamente');
      }
      return true;
    } catch (error) {
      console.error("Error al guardar mascota:", error);
      alert('Error al guardar la mascota');
      return false;
    }
  }

  async function deletePet(petId) {
    try {
      await getPetsRef().child(petId).remove();
      alert('Mascota eliminada correctamente');
      return true;
    } catch (error) {
      console.error("Error al eliminar mascota:", error);
      alert('Error al eliminar la mascota');
      return false;
    }
  }

  newPetForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const petData = {
      name: document.getElementById('petName').value,
      image: document.getElementById('petImage').value,
      type: document.getElementById('petType').value,
      age: parseInt(document.getElementById('petAge').value),
      info: document.getElementById('petInfo').value,
      fecha_creacion: new Date().toISOString()
    };

    const success = await savePet(petData);

    if (success) {
      addPetSection.classList.remove('show-add-pet');
      petsGrid.style.display = 'grid';
      document.querySelector('.page-title').textContent = 'Mascotas en Adopción';
      newPetForm.reset();
      currentPetId = null;
    }
  });

  function setupDeleteButton(deleteBtn, pet) {
    deleteBtn.addEventListener('click', async (e) => {
      e.stopPropagation();
      if (confirm(`¿Estás seguro de que quieres eliminar a ${pet.name}?`)) {
        await deletePet(pet.id);
      }
    });
  }

  function renderPets() {
    petsGrid.innerHTML = '';
    if (pets.length === 0) {
      petsGrid.innerHTML = '<p class="no-pets">No hay mascotas registradas</p>';
      return;
    }

    pets.forEach(pet => {
      const petCard = document.createElement('div');
      petCard.className = 'pet-card';
      petCard.innerHTML = `
        <img src="${pet.image || 'https://via.placeholder.com/150'}" alt="${pet.name}">
        <h3>${pet.name}</h3>
        <button class="delete-pet" data-id="${pet.id}">×</button>
      `;
      petCard.addEventListener('click', (e) => {
        if (!e.target.classList.contains('delete-pet')) {
          openModal(pet);
        }
      });
      const deleteBtn = petCard.querySelector('.delete-pet');
      setupDeleteButton(deleteBtn, pet);
      petsGrid.appendChild(petCard);
    });
  }

  editPetBtn?.addEventListener('click', () => {
    const pet = pets.find(p => p.id === currentPetId);
    if (pet) {
      document.getElementById('petName').value = pet.name;
      document.getElementById('petImage').value = pet.image || '';
      document.getElementById('petType').value = pet.type || 'perro';
      document.getElementById('petAge').value = pet.age || '';
      document.getElementById('petInfo').value = pet.info || '';
      addPetSection.classList.add('show-add-pet');
      petsGrid.style.display = 'none';
      document.querySelector('.page-title').textContent = 'Editar Mascota';
      petModal.style.display = 'none';
    }
  });
});

// Elementos del DOM
/*const petsGrid = document.getElementById('petsGrid');
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
// let currentPetId = null;

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
});*/