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
    localStorage.setItem("token", data.token);
    localStorage.setItem("rol", data.rol);

    // Redirección basada en rol
    switch (data.rol) {
      case "ADMINISTRADOR":
        window.location.href = "admin.html";
        break;
      case "FUNCIONARIO_ADUANA":
        window.location.href = "aduana.html";
        break;
      case "INSPECTOR_SAG":
        window.location.href = "sag.html";
        break;
      default:
        window.location.href = "perfil.html";
    }
  } catch (err) {
    console.error("Error en login:", err);
  }
});
