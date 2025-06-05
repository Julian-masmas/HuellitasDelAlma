document.addEventListener('DOMContentLoaded', () => {
  // Verificar que Firebase esté inicializado
  if (typeof firebase === 'undefined') {
    console.error("Firebase no está cargado");
    return;
  }

  // Elementos del DOM
  const newPetForm = document.getElementById('newPetForm');
  const addPetSection = document.getElementById('addPetSection');
  const petsGrid = document.getElementById('petsGrid');
  const petModal = document.getElementById('petModal');
  const loadingIndicator = document.getElementById('loadingIndicator');
  const noPetsMessage = document.getElementById('noPetsMessage');
  const pageTitle = document.querySelector('.page-title');
  const formTitle = document.getElementById('form-title');
  
  // Botones del sidebar
  const dashboardBtn = document.getElementById('dashboard');
  const addPetBtn = document.getElementById('add-pet');
  const logoutBtn = document.getElementById('logout');
  const cancelAddPetBtn = document.getElementById('cancelAddPet');
  
  // Elementos del modal
  const closeModalBtn = document.getElementById('closeModal');
  const modalPetImage = document.getElementById('modalPetImage');
  const modalPetName = document.getElementById('modalPetName');
  const modalPetInfo = document.getElementById('modalPetInfo');
  const editPetBtn = document.getElementById('editPet');
  const deletePetBtn = document.getElementById('deletePet');

  const requestsSection = document.getElementById('requestsSection');
  const requestsList = document.getElementById('requestsList');
  const requestsLoading = document.getElementById('requestsLoading');
  const noRequestsMessage = document.getElementById('noRequestsMessage');
  const manageRequestsBtn = document.getElementById('manage-requests');
  
  // Toggle del menú
  const menuToggle = document.getElementById('menuToggle');
  const sidebar = document.getElementById('sidebar');

  if (!newPetForm || !addPetSection || !petsGrid) {
    console.error("Faltan elementos clave en el HTML");
    return;
  }

  const db = firebase.database();
  const auth = firebase.auth();

  let currentVetId = null;
  let currentPetId = null;
  let pets = [];
  let petsListener = null;

  const getVetRef = () => db.ref(`Veterinarias/${currentVetId}`);
  const getPetsRef = () => db.ref(`Veterinarias/${currentVetId}/mascotas`);

  // Función para limpiar listeners anteriores
  function cleanupListeners() {
    if (petsListener && currentVetId) {
      getPetsRef().off('value', petsListener);
      petsListener = null;
    }
  }

  // Manejo del menú móvil
  if (menuToggle && sidebar) {
    menuToggle.addEventListener('click', () => {
      sidebar.classList.toggle('active');
    });
  }

  // Autenticación
  auth.onAuthStateChanged(user => {
    console.log("Estado de autenticación cambiado:", user ? "Usuario logueado" : "No logueado");
    
    if (user) {
      currentVetId = user.uid;
      console.log("ID de veterinaria:", currentVetId);
      
      // Mostrar nombre de la veterinaria si está disponible
      const vetNameDisplay = document.getElementById('vet-name-display');
      if (vetNameDisplay) {
        vetNameDisplay.textContent = user.displayName || user.email || 'Panel de Veterinaria';
      }
      
      loadPets();
    } else {
      cleanupListeners();
      window.location.href = 'index.html';
    }
  });

  // Cargar mascotas
  function loadPets() {
    console.log("Cargando mascotas para veterinaria:", currentVetId);
    
    showLoading(true);
    cleanupListeners();
    
    petsListener = (snapshot) => {
      console.log("Datos recibidos de Firebase:", snapshot.val());
      pets = [];
      const petsData = snapshot.val();
      
      if (petsData) {
        Object.keys(petsData).forEach(key => {
          pets.push({ id: key, ...petsData[key] });
        });
      }
      
      console.log("Mascotas procesadas:", pets);
      showLoading(false);
      renderPets();
    };

    getPetsRef().on('value', petsListener, (error) => {
      console.error("Error al cargar mascotas:", error);
      showLoading(false);
      alert('Error al cargar las mascotas: ' + error.message);
    });
  }

  // Mostrar/ocultar indicador de carga
  function showLoading(show) {
    if (loadingIndicator) {
      loadingIndicator.style.display = show ? 'block' : 'none';
    }
  }

  // Renderizar mascotas
  function renderPets() {
    console.log("Renderizando mascotas:", pets.length);
    
    // Ocultar todos los estados primero
    petsGrid.style.display = 'none';
    noPetsMessage.style.display = 'none';
    
    if (pets.length === 0) {
      noPetsMessage.style.display = 'block';
      return;
    }

    // Mostrar grid y renderizar mascotas
    petsGrid.style.display = 'grid';
    petsGrid.innerHTML = '';

    pets.forEach(pet => {
      const petCard = document.createElement('div');
      petCard.className = 'pet-card';
      
      const imageUrl = pet.image && pet.image.trim() !== '' 
        ? pet.image 
        : 'https://via.placeholder.com/300x200?text=Sin+Imagen';

      petCard.innerHTML = `
        <div class="pet-image">
          <img src="${imageUrl}" alt="${pet.name}" onerror="this.src='https://via.placeholder.com/300x200?text=Error+Imagen'">
        </div>
        <div class="pet-info">
          <h3>${pet.name}</h3>
          <p class="pet-type"><strong>Tipo:</strong> ${pet.type || 'No especificado'}</p>
          <p class="pet-age"><strong>Edad:</strong> ${pet.age ? pet.age + ' años' : 'No especificada'}</p>
          <p class="pet-description">${pet.info ? pet.info.substring(0, 100) + '...' : 'Sin descripción'}</p>
        </div>
      `;
      
      // Event listener para abrir modal
      petCard.addEventListener('click', () => {
        openModal(pet);
      });
      
      petsGrid.appendChild(petCard);
    });
  }

  // Abrir modal con información de la mascota
  function openModal(pet) {
    console.log("Abriendo modal para:", pet.name);
    
    if (!petModal) return;
    
    currentPetId = pet.id;
    
    // Llenar modal con datos de la mascota
    if (modalPetImage) {
      modalPetImage.src = pet.image || 'https://via.placeholder.com/400x300?text=Sin+Imagen';
      modalPetImage.alt = pet.name;
    }
    
    if (modalPetName) {
      modalPetName.textContent = pet.name;
    }
    
    if (modalPetInfo) {
      modalPetInfo.innerHTML = `
        <p><strong>Tipo:</strong> ${pet.type || 'No especificado'}</p>
        <p><strong>Edad:</strong> ${pet.age ? pet.age + ' años' : 'No especificada'}</p>
        <p><strong>Información:</strong> ${pet.info || 'Sin información adicional'}</p>
        <p><strong>Fecha de registro:</strong> ${pet.fecha_creacion ? new Date(pet.fecha_creacion).toLocaleDateString() : 'No disponible'}</p>
      `;
    }
    
    petModal.style.display = 'block';
  }

  // Cerrar modal
  function closeModal() {
    if (petModal) {
      petModal.style.display = 'none';
      currentPetId = null;
    }
  }

  // Mostrar formulario para agregar mascota
  function showAddPetForm() {
    currentPetId = null;
    newPetForm.reset();
    
    if (formTitle) {
      formTitle.textContent = 'Agregar Nueva Mascota';
    }
    
    if (pageTitle) {
      pageTitle.textContent = 'Agregar Mascota';
    }
    
    addPetSection.classList.add('show-add-pet');
    petsGrid.style.display = 'none';
    noPetsMessage.style.display = 'none';
    loadingIndicator.style.display = 'none';
  }

  // Mostrar dashboard (lista de mascotas)
  function showDashboard() {
    addPetSection.classList.remove('show-add-pet');
    
    if (pageTitle) {
      pageTitle.textContent = 'Mascotas en Adopción';
    }
    
    renderPets();
  }

  // Editar mascota
  function editPet() {
    const pet = pets.find(p => p.id === currentPetId);
    if (!pet) return;
    
    // Llenar formulario con datos existentes
    document.getElementById('petName').value = pet.name || '';
    document.getElementById('petImage').value = pet.image || '';
    document.getElementById('petType').value = pet.type || '';
    document.getElementById('petAge').value = pet.age || '';
    document.getElementById('petInfo').value = pet.info || '';
    
    if (formTitle) {
      formTitle.textContent = 'Editar Mascota';
    }
    
    if (pageTitle) {
      pageTitle.textContent = 'Editar Mascota';
    }
    
    addPetSection.classList.add('show-add-pet');
    petsGrid.style.display = 'none';
    noPetsMessage.style.display = 'none';
    loadingIndicator.style.display = 'none';
    
    closeModal();
  }

  // Eliminar mascota
  async function deletePetFromModal() {
    if (!currentPetId) return;
    
    const pet = pets.find(p => p.id === currentPetId);
    if (!pet) return;
    
    if (confirm(`¿Estás seguro de que quieres eliminar a ${pet.name}?`)) {
      try {
        await getPetsRef().child(currentPetId).remove();
        alert('Mascota eliminada correctamente');
        closeModal();
      } catch (error) {
        console.error("Error al eliminar mascota:", error);
        alert('Error al eliminar la mascota: ' + error.message);
      }
    }
  }

  // Validar formulario
  function validatePetForm() {
    const name = document.getElementById('petName').value.trim();
    const image = document.getElementById('petImage').value.trim();
    const type = document.getElementById('petType').value;
    const age = document.getElementById('petAge').value;
    const info = document.getElementById('petInfo').value.trim();

    if (!name) {
      alert('El nombre de la mascota es obligatorio');
      return false;
    }

    if (!image) {
      alert('La URL de la imagen es obligatoria');
      return false;
    }

    if (!type) {
      alert('El tipo de mascota es obligatorio');
      return false;
    }

    if (!age || age < 0) {
      alert('La edad debe ser un número válido');
      return false;
    }

    if (!info) {
      alert('La información de la mascota es obligatoria');
      return false;
    }

    return true;
  }

  // Agrega esta función para cargar solicitudes
  function loadAdoptionRequests() {
      requestsLoading.style.display = 'block';
      requestsList.innerHTML = '';
      noRequestsMessage.style.display = 'none';

      db.ref(`Veterinarias/${currentVetId}/solicitudes`).once('value')
          .then(snapshot => {
              const requests = snapshot.val();
              requestsLoading.style.display = 'none';

              if (!requests) {
                  noRequestsMessage.style.display = 'block';
                  return;
              }

              requestsList.innerHTML = '<h3>Solicitudes Recibidas</h3>';
              
              Object.keys(requests).forEach(requestId => {
                  const request = requests[requestId];
                  const requestDate = request.fecha_solicitud ? 
                      new Date(request.fecha_solicitud).toLocaleString() : 'Fecha no disponible';

                  const requestElement = document.createElement('div');
                  requestElement.className = 'request-card';
                  requestElement.innerHTML = `
                      <div class="request-header">
                          <h4>Solicitud para: ${request.petName || 'Mascota no especificada'}</h4>
                          <span class="request-date">${requestDate}</span>
                      </div>
                      <div class="request-body">
                          <p><strong>Solicitante:</strong> ${request.email}</p>
                          <p><strong>Estado:</strong> <span class="request-status">${request.status || 'pendiente'}</span></p>
                          <div class="request-actions">
                              <button class="action-btn approve-btn" data-request-id="${requestId}">Aprobar</button>
                              <button class="action-btn reject-btn" data-request-id="${requestId}">Rechazar</button>
                          </div>
                      </div>
                  `;
                  
                  requestsList.appendChild(requestElement);
              });

              // Agregar event listeners a los botones
              document.querySelectorAll('.approve-btn').forEach(btn => {
                  btn.addEventListener('click', () => updateRequestStatus(btn.getAttribute('data-request-id'), 'aprobada'));
              });
              
              document.querySelectorAll('.reject-btn').forEach(btn => {
                  btn.addEventListener('click', () => updateRequestStatus(btn.getAttribute('data-request-id'), 'rechazada'));
              });
          })
          .catch(error => {
              console.error("Error al cargar solicitudes:", error);
              requestsLoading.style.display = 'none';
              noRequestsMessage.style.display = 'block';
              noRequestsMessage.innerHTML = '<p>Error al cargar las solicitudes. Intenta nuevamente.</p>';
          });
  }

  // Función para actualizar el estado de una solicitud
  async function updateRequestStatus(requestId, newStatus) {
      try {
          await db.ref(`Veterinarias/${currentVetId}/solicitudes/${requestId}`).update({
              status: newStatus
          });
          alert(`Solicitud ${newStatus} correctamente`);
          loadAdoptionRequests(); // Recargar la lista
      } catch (error) {
          console.error("Error al actualizar solicitud:", error);
          alert('Error al actualizar la solicitud: ' + error.message);
      }
  }

  // Función para mostrar la sección de solicitudes
  function showRequestsSection() {
      addPetSection.classList.remove('show-add-pet');
      petsGrid.style.display = 'none';
      noPetsMessage.style.display = 'none';
      loadingIndicator.style.display = 'none';
      requestsSection.style.display = 'block';
      
      if (pageTitle) {
          pageTitle.textContent = 'Gestión de Solicitudes';
      }
      
      loadAdoptionRequests();
  }

  // Agrega este event listener con los demás
  if (manageRequestsBtn) {
      manageRequestsBtn.addEventListener('click', showRequestsSection);
  }

  // Guardar mascota
  async function savePet(petData) {
    try {
      console.log("Guardando mascota:", petData);
      
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
      alert('Error al guardar la mascota: ' + error.message);
      return false;
    }
  }

  // Event Listeners

  // Formulario de mascota
  if (newPetForm) {
    newPetForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      if (!validatePetForm()) {
        return;
      }

      const petData = {
        name: document.getElementById('petName').value.trim(),
        image: document.getElementById('petImage').value.trim(),
        type: document.getElementById('petType').value,
        age: parseInt(document.getElementById('petAge').value),
        info: document.getElementById('petInfo').value.trim(),
        fecha_creacion: new Date().toISOString()
      };

      const success = await savePet(petData);

      if (success) {
        showDashboard();
        currentPetId = null;
      }
    });
  }

  // Botones del sidebar
  if (dashboardBtn) {
    dashboardBtn.addEventListener('click', showDashboard);
  }

  if (addPetBtn) {
    addPetBtn.addEventListener('click', showAddPetForm);
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
        auth.signOut();
      }
    });
  }

  // Botón cancelar
  if (cancelAddPetBtn) {
    cancelAddPetBtn.addEventListener('click', showDashboard);
  }

  // Modal
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
  }

  if (editPetBtn) {
    editPetBtn.addEventListener('click', editPet);
  }

  if (deletePetBtn) {
    deletePetBtn.addEventListener('click', deletePetFromModal);
  }

  // Cerrar modal al hacer clic fuera
  if (petModal) {
    petModal.addEventListener('click', (e) => {
      if (e.target === petModal) {
        closeModal();
      }
    });
  }

  console.log("Script de administración inicializado correctamente");
});
