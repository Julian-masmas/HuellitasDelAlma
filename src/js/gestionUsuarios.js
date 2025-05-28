// Datos de ejemplo de usuarios y solicitudes
const users = [
    {
        id: 1,
        name: "María González",
        email: "maria.gonzalez@example.com",
        requests: [
            { id: 101, petId: 3, petName: "Rocky", date: "2023-05-15", status: "pendiente" },
            { id: 102, petId: 5, petName: "Bella", date: "2023-05-18", status: "aprobada" }
        ]
    },
    {
        id: 2,
        name: "Carlos López",
        email: "carlos.lopez@example.com",
        requests: []
    },
    {
        id: 3,
        name: "Ana Martínez",
        email: "ana.martinez@example.com",
        requests: [
            { id: 103, petId: 2, petName: "Luna", date: "2023-05-20", status: "pendiente" }
        ]
    },
    {
        id: 4,
        name: "Juan Pérez",
        email: "juan.perez@example.com",
        requests: [
            { id: 104, petId: 1, petName: "Max", date: "2023-05-10", status: "rechazada" },
            { id: 105, petId: 4, petName: "Milo", date: "2023-05-12", status: "pendiente" },
            { id: 106, petId: 6, petName: "Simba", date: "2023-05-17", status: "pendiente" }
        ]
    },
    {
        id: 5,
        name: "Laura Sánchez",
        email: "laura.sanchez@example.com",
        requests: []
    }
];

// Elementos del DOM
const usersTable = document.getElementById('usersTable').querySelector('tbody');
const requestsModal = document.getElementById('requestsModal');
const modalUserName = document.getElementById('modalUserName');
const requestsContainer = document.getElementById('requestsContainer');
const closeModal = document.getElementById('closeModal');
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');
let currentUserId = null;

// Generar la tabla de usuarios
function renderUsersTable() {
    usersTable.innerHTML = '';
    users.forEach(user => {
        const row = document.createElement('tr');

        // Estado de las solicitudes
        let requestsStatus;
        if (user.requests.length === 0) {
            requestsStatus = '<span class="no-requests">Sin solicitudes</span>';
        } else {
            requestsStatus = `<a class="view-requests" data-id="${user.id}">Ver solicitudes (${user.requests.length})</a>`;
        }

        row.innerHTML = `
                    <td>${user.id}</td>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>${requestsStatus}</td>
                `;

        usersTable.appendChild(row);
    });

    // Agregar eventos a los enlaces "Ver solicitudes"
    document.querySelectorAll('.view-requests').forEach(link => {
        link.addEventListener('click', (e) => {
            const userId = parseInt(e.target.getAttribute('data-id'));
            showUserRequests(userId);
        });
    });
}

// Mostrar las solicitudes de un usuario en el modal
function showUserRequests(userId) {
    const user = users.find(u => u.id === userId);
    if (user) {
        currentUserId = userId;
        modalUserName.textContent = `Solicitudes de ${user.name}`;

        if (user.requests.length === 0) {
            requestsContainer.innerHTML = '<p class="no-requests">Este usuario no tiene solicitudes de adopción.</p>';
        } else {
            let requestsHTML = `
                        <table class="requests-table">
                            <thead>
                                <tr>
                                    <th>ID Solicitud</th>
                                    <th>Mascota</th>
                                    <th>Fecha</th>
                                    <th>Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                    `;

            user.requests.forEach(request => {
                let statusClass = '';
                if (request.status === 'aprobada') statusClass = 'style="color: green;"';
                if (request.status === 'rechazada') statusClass = 'style="color: red;"';

                requestsHTML += `
                            <tr>
                                <td>${request.id}</td>
                                <td>${request.petName}</td>
                                <td>${formatDate(request.date)}</td>
                                <td ${statusClass}>${request.status.charAt(0).toUpperCase() + request.status.slice(1)}</td>
                            </tr>
                        `;
            });

            requestsHTML += `
                            </tbody>
                        </table>
                    `;

            requestsContainer.innerHTML = requestsHTML;
        }

        requestsModal.style.display = 'flex';
    }
}

// Formatear fecha para mostrarla mejor
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
}

// Cerrar modal
closeModal.addEventListener('click', () => {
    requestsModal.style.display = 'none';
    currentUserId = null;
});

// Cerrar modal al hacer clic fuera del contenido
requestsModal.addEventListener('click', (e) => {
    if (e.target === requestsModal) {
        requestsModal.style.display = 'none';
        currentUserId = null;
    }
});

// Mostrar/ocultar menú en móviles
menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('active');
});

// Funcionalidad de los botones del menú
document.getElementById('dashboard').addEventListener('click', () => {
    alert('Redirigiendo al dashboard');
});

document.getElementById('add-pet').addEventListener('click', () => {
    alert('Redirigiendo a agregar mascota');
});

document.getElementById('manage-pets').addEventListener('click', () => {
    alert('Redirigiendo a gestionar mascotas');
});

document.getElementById('logout').addEventListener('click', () => {
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
        alert('Sesión cerrada. Redirigiendo al inicio...');
        // Aquí iría la redirección a la página de inicio
    }
});

// Inicializar la tabla de usuarios
renderUsersTable();