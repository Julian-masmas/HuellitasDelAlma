// Inicializa EmailJS
(function () {
    emailjs.init('8nK74UYisKYxGN6KG');
})();

document.addEventListener('DOMContentLoaded', () => {
    const db = firebase.database();
    const sendBtn = document.getElementById("sendBtn");
    const emailInput = document.getElementById("email");
    const statusMessage = document.getElementById("statusMessage");
    const petInfoContainer = document.getElementById("petInfoContainer");
    const petImagePreview = document.getElementById("petImagePreview");
    const petNamePreview = document.getElementById("petNamePreview");
    const petDetails = document.getElementById("petDetails");

    // Obtener parámetros de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const petId = urlParams.get('petId');
    const vetId = urlParams.get('vetId');

    // Verificar parámetros
    if (!petId || !vetId) {
        // Intentar obtener de localStorage como respaldo
        const savedPet = localStorage.getItem('selectedPet');
        if (savedPet) {
            const petData = JSON.parse(savedPet);
            showPetInfo(petData);
        } else {
            showError("No se ha especificado la mascota. Por favor regresa y haz clic en 'Adóptame' nuevamente.");
            return;
        }
    } else {
        // Cargar información de la mascota desde Firebase
        loadPetInfo(petId, vetId);
    }

    // Función para cargar información de la mascota
    function loadPetInfo(petId, vetId) {
        db.ref(`Veterinarias/${vetId}/mascotas/${petId}`).once('value')
            .then(snapshot => {
                const petData = snapshot.val();
                if (petData) {
                    const completePetData = {
                        ...petData,
                        id: petId,
                        vetId: vetId
                    };
                    showPetInfo(completePetData);
                } else {
                    showError("No se encontró la mascota especificada.");
                }
            })
            .catch(error => {
                console.error("Error al cargar mascota:", error);
                showError("Error al cargar información de la mascota.");
            });
    }

    // Función para mostrar información de la mascota
    function showPetInfo(petData) {
        petImagePreview.src = petData.image || 'https://via.placeholder.com/200';
        petNamePreview.textContent = petData.name || 'Mascota sin nombre';
        petDetails.innerHTML = `
            <p><strong>Tipo:</strong> ${petData.type || 'No especificado'}</p>
            <p><strong>Edad:</strong> ${petData.age || '?'} años</p>
        `;
        petInfoContainer.style.display = 'block';
    }

    // Función para mostrar errores
    function showError(message) {
        statusMessage.textContent = message;
        statusMessage.style.color = 'red';
        sendBtn.disabled = true;
    }

    // Enviar solicitud de adopción
    sendBtn.addEventListener("click", async function () {
        const email = emailInput.value.trim();
        
        if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email)) {
            statusMessage.textContent = "Por favor ingresa un correo de Gmail válido.";
            statusMessage.style.color = "red";
            return;
        }

        try {
            // Obtener mascota de localStorage si no hay parámetros en URL
            let petData;
            if (petId && vetId) {
                const snapshot = await db.ref(`Veterinarias/${vetId}/mascotas/${petId}`).once('value');
                petData = snapshot.val();
            } else {
                const savedPet = localStorage.getItem('selectedPet');
                if (!savedPet) throw new Error("No hay información de mascota");
                petData = JSON.parse(savedPet);
            }

            if (!petData) throw new Error("No se encontró la mascota");

            // 1. Guardar en Firebase
            const adoptionRequest = {
                email: email,
                petId: petId || petData.id,
                petName: petData.name,
                petType: petData.type,
                petImage: petData.image,
                status: "pendiente",
                fecha_solicitud: new Date().toISOString()
            };

            const vetRef = vetId ? vetId : petData.vetId;
            await db.ref(`Veterinarias/${vetRef}/solicitudes`).push(adoptionRequest);

            // 2. Enviar correo
            const templateParams = {
                email: email,
                name: "Adoptante",
                message: `Gracias por tu interés en adoptar a ${petData.name}. Nos pondremos en contacto contigo pronto.`,
                petName: petData.name,
                petImage: petData.image || 'https://via.placeholder.com/200'
            };

            await emailjs.send("service_la00jmf", "template_ev246fm", templateParams);
            
            // 3. Mostrar éxito
            statusMessage.textContent = "Solicitud enviada correctamente. Revisa tu correo.";
            statusMessage.style.color = "green";
            emailInput.value = "";
            
        } catch (error) {
            console.error("Error en el proceso:", error);
            statusMessage.textContent = "Error al procesar la solicitud. Intenta más tarde.";
            statusMessage.style.color = "red";
        }
    });
});