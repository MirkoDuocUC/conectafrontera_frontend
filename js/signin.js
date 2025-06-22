document.getElementById("loginFormViajero").addEventListener("submit", async function(e) {
  e.preventDefault();
  document.getElementById("error").classList.add("d-none");
  document.getElementById("denegado").classList.add("d-none");

  const correo = document.getElementById("usuario").value;
  const contrasena = document.getElementById("contrasena").value;

  try {
    const res = await fetch("http://localhost:8080/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ correo, contrasena }),
    });

    if (!res.ok) {
      document.getElementById("error").classList.remove("d-none");
      return;
    }

    const data = await res.json();
    const rol = (data.rol || "").toUpperCase().trim();

    if (rol !== "VIAJERO") {
      document.getElementById("denegado").classList.remove("d-none");
      return;
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("rol", data.rol);
    window.location.href = "viajero.html";
  } catch (err) {
    document.getElementById("error").classList.remove("d-none");
  }
});