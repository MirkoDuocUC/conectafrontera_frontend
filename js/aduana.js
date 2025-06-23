document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const rol = localStorage.getItem("rol");

  // Validación de sesión y rol
  if (!token || !rol || !["FUNCIONARIO_ADUANA", "INSPECTOR_SAG"].includes(rol)) {
    window.location.href = "login.html";
    return;
  }

  // Cargar datos según el rol
  if (rol === "FUNCIONARIO_ADUANA") {
    fetchDocumentos();
  } else if (rol === "INSPECTOR_SAG") {
    fetchVehiculos();
  }

  // Si tienes un botón de logout, descomenta la siguiente línea y agrega el botón con id="logoutBtn" en tu HTML
  // document.getElementById("logoutBtn").addEventListener("click", () => {
  //   localStorage.clear();
  //   window.location.href = "login.html";
  // });
});

// Obtener documentos pendientes
async function fetchDocumentos() {
  try {
    const res = await fetch("http://localhost:8080/api/documentos", {
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

    if (!res.ok) throw new Error("Error al obtener documentos");

    const documentos = await res.json();
    const tbody = document.getElementById("tabla-documentos");
    tbody.innerHTML = "";

    documentos.forEach((documento) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${documento.id}</td>
        <td>${documento.tipo}</td>
        <td>${documento.numero}</td>
        <td>${documento.fechaEmision}</td>
        <td>${documento.fechaVencimiento}</td>
        <td>
          <button type="button" class="btn btn-success btn-sm me-2" onclick="validarDocumento(${documento.id}, 'aprobado')">Aprobar</button>
          <button type="button" class="btn btn-danger btn-sm" onclick="validarDocumento(${documento.id}, 'rechazado')">Rechazar</button>
        </td>
        <td>
          <input type="text" class="form-control form-control-sm" placeholder="Comentario" id="comentario-${documento.id}" />
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (error) {
    console.error("Error cargando documentos:", error);
    alert("No se pudieron cargar los documentos. Verifica el token o el servidor.");
  }
}

// Aprobar o rechazar documento
async function validarDocumento(id, estado) {
  const comentario = document.getElementById(`comentario-${id}`)?.value || '';

  try {
    const res = await fetch(`http://localhost:8080/api/documentos/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({ estado, comentario }),
    });

    if (res.status === 401 || res.status === 403) {
      alert("Sesión expirada o sin permisos. Inicia sesión nuevamente.");
      localStorage.clear();
      window.location.href = "login.html";
      return;
    }

    if (!res.ok) throw new Error("Error al validar el documento");

    alert("Documento validado correctamente");
    fetchDocumentos();
  } catch (error) {
    console.error("Error validando documento:", error);
    alert("Error al validar el documento.");
  }
}

// Obtener vehículos (para INSPECTOR_SAG o cualquier sección de vehículos)
async function fetchVehiculos() {
  try {
    const res = await fetch("http://localhost:8080/api/vehiculos", {
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

    if (!res.ok) throw new Error("Error al obtener vehículos");

    const vehiculos = await res.json();
    const tbody = document.getElementById("vehiculosTableBody");
    if (!tbody) return;
    tbody.innerHTML = "";

    vehiculos.forEach((vehiculo) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${vehiculo.id}</td>
        <td>${vehiculo.patente}</td>
        <td>${vehiculo.tipo}</td>
        <td>${vehiculo.fechaIngreso}</td>
        <td>${vehiculo.fechaSalidaEstimada}</td>
        <td class="text-center">
          <button type="button" class="btn btn-primary btn-sm" onclick="generarPermiso(${vehiculo.id})">Generar Permiso</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (error) {
    console.error("Error cargando vehículos:", error);
    alert("No se pudieron cargar los vehículos. Verifica el token o el servidor.");
  }
}

// Generar permiso vehicular
async function generarPermiso(idVehiculo) {
  try {
    const res = await fetch(`http://localhost:8080/api/vehiculos/${idVehiculo}`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });

    if (res.status === 401 || res.status === 403) {
      alert("Sesión expirada o sin permisos. Inicia sesión nuevamente.");
      localStorage.clear();
      window.location.href = "login.html";
      return;
    }

    if (!res.ok) throw new Error("Error al generar el permiso");

    const blob = await res.blob();
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "permiso_vehiculo.pdf";
    link.click();
  } catch (error) {
    console.error("Error generando el permiso vehicular:", error);
    alert("No se pudo generar el permiso vehicular.");
  }
}

// Obtener declaraciones (para FUNCIONARIO_ADUANA o cualquier sección de declaraciones)
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
    const tbody = document.getElementById("declaracionesTableBody");
    if (!tbody) return;
    tbody.innerHTML = "";

    declaraciones.forEach((dec) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${dec.id}</td>
        <td>${dec.estado}</td>
        <td>${dec.idViajero}</td>
        <td>${dec.nombreViajero}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (error) {
    console.error("Error cargando declaraciones:", error);
    alert("No se pudieron cargar las declaraciones. Verifica el token o el servidor.");
  }
}

// Obtener reportes (para FUNCIONARIO_ADUANA o INSPECTOR_SAG o cualquier sección de reportes)
async function fetchReportes() {
  try {
    const res = await fetch("http://localhost:8080/api/reportes", {
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

    if (!res.ok) throw new Error("Error al obtener reportes");

    const reportes = await res.json();
    const tbody = document.getElementById("reportesTableBody");
    if (!tbody) return;
    tbody.innerHTML = "";

    reportes.forEach((reporte) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${reporte.idReporte}</td>
        <td>${reporte.tipo}</td>
        <td>${reporte.fechaGeneracion}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (error) {
    console.error("Error cargando reportes:", error);
    alert("No se pudieron cargar los reportes. Verifica el token o el servidor.");
  }
}

// Hacer accesibles las funciones globalmente para los botones inline
window.validarDocumento = validarDocumento;
window.generarPermiso = generarPermiso;