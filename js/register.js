document.getElementById("registerForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const correo = document.getElementById("correo").value;
    const contrasena = document.getElementById("contrasena").value;
    const rol = document.getElementById("rol").value;

    try {
        const res = await fetch("http://localhost:8080/api/usuarios", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre, correo, contrasena, rol }),
        });

        if (!res.ok) {
            document.getElementById("error").classList.remove("hidden");
            return;
        }

        // Redirigir según el rol
        if (rol === "VIAJERO") {
            window.location.href = "signin.html";
        } else {
            window.location.href = "login.html";
        }
    } catch (err) {
        console.error("Error en registro:", err);
        document.getElementById("error").classList.remove("hidden");
    }
});
