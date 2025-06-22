document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const correo = document.getElementById("correo").value;
  const contrasena = document.getElementById("contrasena").value;

  try {
    const res = await fetch("http://localhost:8080/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ correo, contrasena }),
    });

    if (!res.ok) {
      document.getElementById("error").classList.remove("hidden");
      return;
    }

    const data = await res.json();
    console.log("Respuesta completa:", data); // <-- Esto imprime todo el objeto recibido
    localStorage.setItem("token", data.token);
    localStorage.setItem("rol", data.rol);
    console.log("Rol recibido:", data.rol);

    const rol = (data.rol || "").toUpperCase().trim();

    // Redirección basada en rol
    switch (rol) {
      case "ADMINISTRADOR":
        window.location.href = "admin.html";
        break;
      case "FUNCIONARIO_ADUANA":
        window.location.href = "aduana.html";
        break;
      case "INSPECTOR_SAG":
        window.location.href = "sag.html";
        break;
      case "VIAJERO":
        window.location.href = "viajero.html";
        break;
      default:
        window.location.href = "perfil.html";
    }
  } catch (err) {
    console.error("Error en login:", err);
  }
});
