document.getElementById("registerForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const correo = document.getElementById("correo").value;
    const contrasena = document.getElementById("contrasena").value;
    const rol = document.getElementById("rol").value;

    try {
        const res = await fetch("http://localhost:8080/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre, correo, contrasena, rol }),
        });

        if (!res.ok) {
            document.getElementById("error").classList.remove("hidden");
            return;
        }

        window.location.href = "login.html";
    } catch (err) {
        console.error("Error en registro:", err);
        document.getElementById("error").classList.remove("hidden");
    }
});
