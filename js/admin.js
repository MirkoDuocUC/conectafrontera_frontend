document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const rol = localStorage.getItem("rol");

  // Validación de sesión y rol
  if (!token || rol !== "ADMINISTRADOR") {
    window.location.href = "login.html";
    return;
  }

  cargarUsuarios();

  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "login.html";
  });

  // Mostrar campo extra solo si el rol es INSPECTOR_SAG
  const rolSelect = document.getElementById("nuevoRol");
  const tipoInspectorContainer = document.getElementById("tipoInspectorContainer");
  const tipoInspector = document.getElementById("tipoInspector");

  rolSelect.addEventListener("change", function() {
    if (this.value === "INSPECTOR_SAG") {
      tipoInspectorContainer.style.display = "";
      tipoInspector.required = true;
    } else {
      tipoInspectorContainer.style.display = "none";
      tipoInspector.required = false;
      tipoInspector.value = "";
    }
  });
});

async function cargarUsuarios() {
  try {
    const res = await fetch("http://localhost:8080/api/usuarios", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      }
    });

    if (res.status === 401 || res.status === 403) {
      alert("Sesión expirada o sin permisos. Inicia sesión nuevamente.");
      localStorage.clear();
      window.location.href = "login.html";
      return;
    }

    if (!res.ok) {
      throw new Error("Error al obtener usuarios");
    }

    const usuarios = await res.json();
    const tbody = document.getElementById("usuariosTableBody");
    tbody.innerHTML = "";

    usuarios.forEach((usuario) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${usuario.idUsuario}</td>
        <td>${usuario.nombre}</td>
        <td>${usuario.correo}</td>
        <td>${usuario.rol}</td>
        <td class="text-center">
          <button type="button" class="btn btn-warning btn-sm text-white me-2"
            onclick="mostrarFormularioEditar(${usuario.idUsuario}, '${usuario.nombre.replace(/'/g, "\\'")}', '${usuario.correo.replace(/'/g, "\\'")}', '${usuario.rol}')">
            Editar
          </button>
          <button type="button" class="btn btn-danger btn-sm"
            onclick="eliminarUsuario(${usuario.idUsuario})">
            Eliminar
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (error) {
    console.error("Error cargando usuarios:", error);
    alert("No se pudieron cargar los usuarios. Verifica el token o el servidor.");
  }
}

document.getElementById("formNuevoUsuario").addEventListener("submit", async (e) => {
  e.preventDefault();

  const nombre = document.getElementById("nuevoNombre").value.trim();
  const correo = document.getElementById("nuevoCorreo").value.trim();
  const contrasena = document.getElementById("nuevaContrasena").value.trim();
  const rol = document.getElementById("nuevoRol").value;
  const tipoInspector = document.getElementById("tipoInspector") ? document.getElementById("tipoInspector").value : "";
  const tipoFuncionario = document.getElementById("tipoFuncionario") ? document.getElementById("tipoFuncionario").value : "";
  const nivelPermiso = document.getElementById("nivelPermiso") ? document.getElementById("nivelPermiso").value : "";

  let endpoint = "";
  let body = {};

  if (rol === "FUNCIONARIO_ADUANA") {
    if (!tipoFuncionario) {
      alert("Debes seleccionar el tipo de funcionario aduana.");
      return;
    }
    endpoint = "http://localhost:8080/api/funcionarios-aduana";
    body = { nombre, correo, contrasena, puesto: tipoFuncionario };
  } else if (rol === "INSPECTOR_SAG") {
    if (!tipoInspector) {
      alert("Debes seleccionar el tipo de inspector SAG.");
      return;
    }
    endpoint = "http://localhost:8080/api/inspectores";
    body = { nombre, correo, contrasena, especialidad: tipoInspector };
  } else if (rol === "VIAJERO") {
    endpoint = "http://localhost:8080/api/viajeros";
    body = { nombre, correo, contrasena };
  } else if (rol === "ADMINISTRADOR") {
    if (!nivelPermiso) {
      alert("Debes ingresar el nivel de permiso del administrador.");
      return;
    }
    endpoint = "http://localhost:8080/api/administradores";
    body = { nombre, correo, contrasena, nivelPermiso };
  } else {
    alert("Rol no válido.");
    return;
  }

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify(body),
    });

    if (res.status === 401 || res.status === 403) {
      alert("Sesión expirada o sin permisos. Inicia sesión nuevamente.");
      localStorage.clear();
      window.location.href = "login.html";
      return;
    }

    if (!res.ok) throw new Error("No se pudo registrar el usuario");

    alert("Usuario registrado correctamente");
    document.getElementById("formNuevoUsuario").reset();
    if (document.getElementById("tipoInspectorContainer")) {
      document.getElementById("tipoInspectorContainer").style.display = "none";
    }
    if (document.getElementById("tipoFuncionarioContainer")) {
      document.getElementById("tipoFuncionarioContainer").style.display = "none";
    }
    if (document.getElementById("nivelPermisoContainer")) {
      document.getElementById("nivelPermisoContainer").style.display = "none";
    }
    cargarUsuarios();
  } catch (err) {
    console.error("Error al registrar:", err);
    alert("Error al registrar usuario. Verifica los datos o el token.");
  }
});

// Hacer global para el HTML dinámico
window.eliminarUsuario = async function(id) {
  if (!confirm("¿Estás seguro de eliminar este usuario?")) return;

  try {
    const res = await fetch(`http://localhost:8080/api/usuarios/${id}`, {
      method: "DELETE",
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

    if (!res.ok) throw new Error("Error al eliminar");

    alert("Usuario eliminado correctamente");
    cargarUsuarios();
  } catch (err) {
    console.error("Error al eliminar:", err);
    alert("No se pudo eliminar el usuario.");
  }
};

// Mostrar modal para editar usuario
window.mostrarFormularioEditar = function(id, nombre, correo, rol) {
  document.getElementById("editarIdUsuarioModal").value = id;
  document.getElementById("editarNombreModal").value = nombre;
  document.getElementById("editarCorreoModal").value = correo;
  document.getElementById("editarRolModal").value = rol;
  document.getElementById("editarContrasenaModal").value = "";
  const modal = new bootstrap.Modal(document.getElementById('editarUsuarioModal'));
  modal.show();
};

document.getElementById("formEditarUsuarioModal").addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = document.getElementById("editarIdUsuarioModal").value;
  const nombre = document.getElementById("editarNombreModal").value.trim();
  const correo = document.getElementById("editarCorreoModal").value.trim();
  const contrasena = document.getElementById("editarContrasenaModal").value.trim();
  const rol = document.getElementById("editarRolModal").value;

  try {
    const res = await fetch(`http://localhost:8080/api/usuarios/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({ nombre, correo, rol, contrasena }),
    });

    if (res.status === 401 || res.status === 403) {
      alert("Sesión expirada o sin permisos. Inicia sesión nuevamente.");
      localStorage.clear();
      window.location.href = "login.html";
      return;
    }

    if (!res.ok) throw new Error("Error al actualizar");

    alert("Usuario actualizado correctamente");
    document.getElementById("formEditarUsuarioModal").reset();
    const modal = bootstrap.Modal.getInstance(document.getElementById('editarUsuarioModal'));
    modal.hide();
    cargarUsuarios();
  } catch (err) {
    console.error("Error al actualizar:", err);
    alert("No se pudo actualizar el usuario.");
  }
});
