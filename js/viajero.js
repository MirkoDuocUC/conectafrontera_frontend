// Lógica para manejar el formulario de Pre-registro y las notificaciones, con validación de token

document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    const rol = localStorage.getItem("rol");

    // Validación de sesión y rol
    if (!token || rol !== "VIAJERO") {
        window.location.href = "login.html";
        return;
    }

    document.getElementById("logoutBtn")?.addEventListener("click", () => {
        localStorage.clear();
        window.location.href = "login.html";
    });

    document.getElementById("formPreRegistro").addEventListener("submit", async function(event) {
        event.preventDefault();

        // Obtener los valores de los campos del formulario
        const tipoDocumento = document.getElementById("tipoDocumento").value;
        const numeroDocumento = document.getElementById("numeroDocumento").value;
        const fechaEmision = document.getElementById("fechaEmision").value;
        const fechaVencimiento = document.getElementById("fechaVencimiento").value;

        // Validación sencilla
        if (tipoDocumento && numeroDocumento && fechaEmision && fechaVencimiento) {
            try {
                const res = await fetch("http://localhost:8080/api/documentos", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + localStorage.getItem("token"),
                    },
                    body: JSON.stringify({
                        tipo: tipoDocumento,
                        numero: numeroDocumento,
                        fechaEmision: fechaEmision,
                        fechaVencimiento: fechaVencimiento
                    })
                });

                if (res.status === 401 || res.status === 403) {
                    alert("Sesión expirada o sin permisos. Inicia sesión nuevamente.");
                    localStorage.clear();
                    window.location.href = "login.html";
                    return;
                }

                if (!res.ok) throw new Error("No se pudo registrar el documento");

                // Mostrar notificación de éxito
                document.getElementById("notificacion1").classList.remove("d-none");
                document.getElementById("notificacion2").classList.add("d-none");
                document.getElementById("formPreRegistro").reset();
                console.log('Documento registrado correctamente');
            } catch (error) {
                console.error('Error al registrar los documentos:', error);
                // Mostrar un mensaje de error si la solicitud falla
                document.getElementById("notificacion2").classList.remove("d-none");
                document.getElementById("notificacion1").classList.add("d-none");
            }
        } else {
            // Mostrar notificación de falta de documento
            document.getElementById("notificacion2").classList.remove("d-none");
            document.getElementById("notificacion1").classList.add("d-none");
        }
    });
});
