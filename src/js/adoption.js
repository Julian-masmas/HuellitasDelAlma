(function () {
            emailjs.init('8nK74UYisKYxGN6KG'); // ⬅️ Reemplaza con tu public key
        })();

        document.getElementById("sendBtn").addEventListener("click", function () {
            const email = document.getElementById("email").value;
            const statusMessage = document.getElementById("statusMessage");

            if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email)) {
                statusMessage.textContent = "Por favor ingresa un correo de Gmail válido.";
                statusMessage.style.color = "red";
                return;
            }

            const templateParams = {
                email: email,
                name: "Adoptante",
                message: "Gracias por tu interés en adoptar una mascota. Nos pondremos en contacto contigo pronto.",
            };

            emailjs.send("service_la00jmf", "template_ev246fm", templateParams)
                .then(() => {
                    statusMessage.textContent = "Solicitud enviada correctamente. Revisa tu correo.";
                    statusMessage.style.color = "green";
                    document.getElementById("email").value = "";
                })
                .catch((error) => {
                    console.error("Error al enviar correo:", error);
                    statusMessage.textContent = "Error al enviar la solicitud. Intenta más tarde.";
                    statusMessage.style.color = "red";
                });
        });