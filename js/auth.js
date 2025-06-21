function verificarAutenticacion(rolesPermitidos = []) {
    const token = localStorage.getItem("token");
    const rol = localStorage.getItem("rol");

    if (!token || !rol || (rolesPermitidos.length && !rolesPermitidos.includes(rol))) {
        alert("Acceso denegado. Redirigiendo a login...");
        window.location.href = "login.html";
    }
}
