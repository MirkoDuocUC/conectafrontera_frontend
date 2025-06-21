document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const rol = localStorage.getItem("rol");

  if (!token || rol !== "ADMINISTRADOR") {
    window.location.href = "../src/login.html";
    return;
  }

  cargarUsuarios();

  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "../src/login.html";
  });
});

async function cargarUsuarios() {
  try {
    const res = await fetch("http://localhost:8080/api/usuarios", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      credentials: "include", // 🔥 Necesario para CORS + token
    });

    if (!res.ok) {
      throw new Error("Error al obtener usuarios");
    }

    const usuarios = await res.json();
    const container = document.getElementById("usuariosContainer");
    container.innerHTML = "";

    usuarios.forEach((usuario) => {
      const div = document.createElement("div");
      div.className =
        "bg-white rounded shadow p-4 border border-gray-200";
      div.innerHTML = `
  <p><strong>ID:</strong> ${usuario.idUsuario}</p>
  <p><strong>Nombre:</strong> ${usuario.nombre}</p>
  <p><strong>Correo:</strong> ${usuario.correo}</p>
  <p><strong>Rol:</strong> ${usuario.rol}</p>
  <div class="mt-2 flex gap-2">
    <button onclick="eliminarUsuario(${usuario.idUsuario})" class="bg-red-500 text-black px-2 py-1 rounded text-sm">Eliminar</button>
    <button onclick="mostrarFormularioEditar(${usuario.idUsuario}, '${usuario.nombre}', '${usuario.correo}', '${usuario.rol}')" class="bg-yellow-500 text-black px-2 py-1 rounded text-sm">Editar</button>
  </div>
`;
      container.appendChild(div);
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

  try {
    const res = await fetch("http://localhost:8080/api/usuarios", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({ nombre, correo, contrasena, rol }),
    });

    if (!res.ok) throw new Error("No se pudo registrar el usuario");

    alert("Usuario registrado correctamente");
    document.getElementById("formNuevoUsuario").reset();
    cargarUsuarios();
  } catch (err) {
    console.error("Error al registrar:", err);
    alert("Error al registrar usuario. Verifica los datos o el token.");
  }
});

async function eliminarUsuario(id) {
  if (!confirm("¿Estás seguro de eliminar este usuario?")) return;

  try {
    const res = await fetch(`http://localhost:8080/api/usuarios/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });

    if (!res.ok) throw new Error("Error al eliminar");

    alert("Usuario eliminado correctamente");
    cargarUsuarios();
  } catch (err) {
    console.error("Error al eliminar:", err);
    alert("No se pudo eliminar el usuario.");
  }
}

function mostrarFormularioEditar(id, nombre, correo, rol) {
  document.getElementById("editarIdUsuario").value = id;
  document.getElementById("editarNombre").value = nombre;
  document.getElementById("editarCorreo").value = correo;
  document.getElementById("editarRol").value = rol;
  document.getElementById("editarUsuarioSection").classList.remove("hidden");
}

document.getElementById("formEditarUsuario").addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = document.getElementById("editarIdUsuario").value;
  const nombre = document.getElementById("editarNombre").value.trim();
  const correo = document.getElementById("editarCorreo").value.trim();
  const contrasena = document.getElementById("editarContrasena").value.trim();
  const rol = document.getElementById("editarRol").value;

  try {
    const res = await fetch(`http://localhost:8080/api/usuarios/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({ nombre, correo, rol, contrasena }),
    });

    if (!res.ok) throw new Error("Error al actualizar");

    alert("Usuario actualizado correctamente");
    document.getElementById("formEditarUsuario").reset();
    document.getElementById("editarUsuarioSection").classList.add("hidden");
    cargarUsuarios();
  } catch (err) {
    console.error("Error al actualizar:", err);
    alert("No se pudo actualizar el usuario.");
  }
});
