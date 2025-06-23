document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const rol = localStorage.getItem("rol");

  // Solo permite acceso a INSPECTOR_SAG
  if (!token || rol !== "INSPECTOR_SAG") {
    window.location.href = "login.html";
    return;
  }

  fetchDeclaraciones();

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.clear();
      window.location.href = "login.html";
    });
  }
});

// Obtener declaraciones juradas (DTO: id, estado, idViajero, nombreViajero)
async function fetchDeclaraciones() {
  try {
    const res = await fetch("http://localhost:8080/api/declaraciones", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });

    if (res.status === 401 || res.status === 403) {
      alert("Sesión expirada o sin permisos. Inicia sesión nuevamente.");
      localStorage.clear();
      window.location.href = "login.html";
      return;
    }

    if (!res.ok) throw new Error("Error al obtener declaraciones");

    const declaraciones = await res.json();
    const tbody = document.getElementById("tablaDeclaraciones");
    if (!tbody) return;
    tbody.innerHTML = "";

    declaraciones.forEach((dec) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td class="text-center">${dec.id}</td>
        <td>${dec.nombreViajero}</td>
        <td class="text-center">-</td>
        <td class="text-center">-</td>
        <td class="text-center">${dec.estado}</td>
        <td class="text-center">
          <button type="button" class="btn btn-success btn-sm me-2" onclick="validarDeclaracion(${dec.id}, 'PERMITIDO')">Permitir</button>
          <button type="button" class="btn btn-danger btn-sm" onclick="validarDeclaracion(${dec.id}, 'PROHIBIDO')">Prohibir</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (error) {
    console.error("Error cargando declaraciones:", error);
    alert("No se pudieron cargar las declaraciones. Verifica el token o el servidor.");
  }
}

// Validar declaración jurada
window.validarDeclaracion = async function(id, estado) {
  try {
    const res = await fetch(`http://localhost:8080/api/declaraciones/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token")
      },
      body: JSON.stringify({ estado })
    });

    if (!res.ok) throw new Error("Fallo en validación");
    alert("Declaración validada correctamente");
    fetchDeclaraciones();
  } catch (err) {
    console.error(err);
    alert("No se pudo validar la declaración.");
  }
};