document.addEventListener("DOMContentLoaded", () => {
    const root = document.getElementById("dashboard-root");

    // Mapeo de módulos a funciones render
    const modulos = {
        dashboard: renderDashboard,
        viajeros: renderViajeros,
        vehiculos: renderVehiculos,
        documentos: renderDocumentos,
        declaraciones: renderDeclaraciones,
        reportes: renderReportes
    };

    // Navegación por sidebar
    document.querySelectorAll("aside nav a").forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const modulo = link.dataset.modulo;
            root.innerHTML = ""; // Limpiar vista
            modulos[modulo]?.(); // Renderizar módulo
        });
    });

    // Cargar dashboard por defecto
    renderDashboard();

    // -------------------------
    // 🎯 Módulo Dashboard
    function renderDashboard() {
        root.innerHTML = `
      <h2 class="text-2xl font-bold mb-4 text-gray-800">📊 Resumen General</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div id="box-viajeros" class="bg-blue-100 p-4 rounded shadow"></div>
        <div id="box-vehiculos" class="bg-green-100 p-4 rounded shadow"></div>
        <div id="box-declaraciones" class="bg-purple-100 p-4 rounded shadow"></div>
      </div>
    `;

        fetch("http://localhost:8080/api/viajeros")
            .then(res => res.json())
            .then(data => {
                document.getElementById("box-viajeros").innerHTML = `
          <h3 class="font-bold text-blue-900 text-lg">🧍‍♂️ Viajeros</h3>
          <p>Total: ${data.length}</p>
        `;
            });

        fetch("http://localhost:8080/api/vehiculos")
            .then(res => res.json())
            .then(data => {
                document.getElementById("box-vehiculos").innerHTML = `
          <h3 class="font-bold text-green-900 text-lg">🚗 Vehículos</h3>
          <p>Total: ${data.length}</p>
        `;
            });

        fetch("http://localhost:8080/api/declaraciones")
            .then(res => res.json())
            .then(data => {
                document.getElementById("box-declaraciones").innerHTML = `
          <h3 class="font-bold text-purple-900 text-lg">📑 Declaraciones</h3>
          <p>Total: ${data.length}</p>
        `;
            });
    }

    // -------------------------
    // 👤 Módulo Viajeros
    function renderViajeros() {
        document.getElementById("dashboard-root").innerHTML = `
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-bold text-gray-800">🧍‍♂️ Lista de Viajeros</h2>
      <button id="btn-nuevo-viajero" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        + Registrar Viajero
      </button>
    </div>

    <div id="formulario-viajero" class="mb-6 hidden bg-white p-4 rounded shadow">
      <h3 class="font-semibold mb-2">Nuevo Viajero</h3>
      <form id="viajero-form" class="space-y-3">
        <input type="text" name="nombre" placeholder="Nombre" required class="w-full border px-3 py-2 rounded" />
        <input type="email" name="correo" placeholder="Correo" required class="w-full border px-3 py-2 rounded" />
        <input type="password" name="contrasena" placeholder="Contraseña" required class="w-full border px-3 py-2 rounded" />
        <button type="submit" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Guardar</button>
      </form>
    </div>

    <div class="overflow-x-auto">
      <table class="min-w-full bg-white border border-gray-300 rounded shadow">
        <thead class="bg-gray-100">
          <tr>
            <th class="text-left px-4 py-2">ID</th>
            <th class="text-left px-4 py-2">Nombre</th>
            <th class="text-left px-4 py-2">Correo</th>
          </tr>
        </thead>
        <tbody id="tabla-viajeros" class="text-gray-800"></tbody>
      </table>
    </div>
  `;

        // Mostrar formulario
        document.getElementById("btn-nuevo-viajero").addEventListener("click", () => {
            document.getElementById("formulario-viajero").classList.toggle("hidden");
        });

        // Subir datos del formulario
        document.getElementById("viajero-form").addEventListener("submit", (e) => {
            e.preventDefault();
            const form = e.target;

            const nuevoViajero = {
                nombre: form.nombre.value,
                correo: form.correo.value,
                contrasena: form.contrasena.value
            };

            fetch("http://localhost:8080/api/viajeros", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(nuevoViajero)
            })
                .then(res => {
                    if (!res.ok) throw new Error("Error al registrar");
                    return res.json();
                })
                .then(() => {
                    renderViajeros(); // recargar tabla
                })
                .catch(err => alert("Error: " + err.message));
        });

        // Cargar tabla
        fetch("http://localhost:8080/api/viajeros")
            .then(res => res.json())
            .then(data => {
                const tbody = document.getElementById("tabla-viajeros");
                data.forEach(v => {
                    const fila = document.createElement("tr");
                    fila.className = "border-t";
                    fila.innerHTML = `
          <td class="px-4 py-2">${v.idUsuario}</td>
          <td class="px-4 py-2">${v.nombre}</td>
          <td class="px-4 py-2">${v.correo}</td>
        `;
                    tbody.appendChild(fila);
                });
            });
    }


    // -------------------------
    // 🚗 Vehículos
    function renderVehiculos() {
        document.getElementById("dashboard-root").innerHTML = `
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-bold text-gray-800">🚗 Lista de Vehículos</h2>
      <button id="btn-nuevo-vehiculo" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        + Registrar Vehículo
      </button>
    </div>

    <div id="formulario-vehiculo" class="mb-6 hidden bg-white p-4 rounded shadow">
      <h3 class="font-semibold mb-2">Nuevo Vehículo</h3>
      <form id="vehiculo-form" class="space-y-3">
        <input type="text" name="patente" placeholder="Patente" required class="w-full border px-3 py-2 rounded" />
        <input type="text" name="tipo" placeholder="Tipo (ej. Furgón)" required class="w-full border px-3 py-2 rounded" />
        <input type="date" name="fechaIngreso" required class="w-full border px-3 py-2 rounded" />
        <input type="date" name="fechaSalidaEstimada" class="w-full border px-3 py-2 rounded" />
        <button type="submit" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Guardar</button>
      </form>
    </div>

    <div class="overflow-x-auto">
      <table class="min-w-full bg-white border border-gray-300 rounded shadow">
        <thead class="bg-gray-100">
          <tr>
            <th class="text-left px-4 py-2">ID</th>
            <th class="text-left px-4 py-2">Patente</th>
            <th class="text-left px-4 py-2">Tipo</th>
            <th class="text-left px-4 py-2">Ingreso</th>
            <th class="text-left px-4 py-2">Salida Estimada</th>
          </tr>
        </thead>
        <tbody id="tabla-vehiculos" class="text-gray-800"></tbody>
      </table>
    </div>
  `;

        // Mostrar formulario
        document.getElementById("btn-nuevo-vehiculo").addEventListener("click", () => {
            document.getElementById("formulario-vehiculo").classList.toggle("hidden");
        });

        // Subir datos del formulario
        document.getElementById("vehiculo-form").addEventListener("submit", (e) => {
            e.preventDefault();
            const form = e.target;

            const nuevoVehiculo = {
                patente: form.patente.value,
                tipo: form.tipo.value,
                fechaIngreso: form.fechaIngreso.value,
                fechaSalidaEstimada: form.fechaSalidaEstimada.value || null
            };

            fetch("http://localhost:8080/api/vehiculos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(nuevoVehiculo)
            })
                .then(res => {
                    if (!res.ok) throw new Error("Error al registrar");
                    return res.json();
                })
                .then(() => {
                    renderVehiculos(); // recargar tabla
                })
                .catch(err => alert("Error: " + err.message));
        });

        // Obtener tabla
        fetch("http://localhost:8080/api/vehiculos")
            .then(res => res.json())
            .then(data => {
                const tbody = document.getElementById("tabla-vehiculos");
                data.forEach(v => {
                    const fila = document.createElement("tr");
                    fila.className = "border-t";
                    fila.innerHTML = `
          <td class="px-4 py-2">${v.idVehiculo}</td>
          <td class="px-4 py-2">${v.patente}</td>
          <td class="px-4 py-2">${v.tipo}</td>
          <td class="px-4 py-2">${v.fechaIngreso ?? "-"}</td>
          <td class="px-4 py-2">${v.fechaSalidaEstimada ?? "-"}</td>
        `;
                    tbody.appendChild(fila);
                });
            });
    }



    // 📄 Documentos
    function renderDocumentos() {
        document.getElementById("dashboard-root").innerHTML = `
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-bold text-gray-800">📄 Lista de Documentos</h2>
      <button id="btn-nuevo-documento" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        + Registrar Documento
      </button>
    </div>

    <div id="formulario-documento" class="mb-6 hidden bg-white p-4 rounded shadow">
      <h3 class="font-semibold mb-2">Nuevo Documento</h3>
      <form id="documento-form" class="space-y-3">
        <input type="text" name="tipo" placeholder="Tipo (Pasaporte, Cédula...)" required class="w-full border px-3 py-2 rounded" />
        <input type="text" name="numero" placeholder="Número" required class="w-full border px-3 py-2 rounded" />
        <input type="date" name="fechaEmision" required class="w-full border px-3 py-2 rounded" />
        <input type="date" name="fechaVencimiento" required class="w-full border px-3 py-2 rounded" />
        <button type="submit" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Guardar</button>
      </form>
    </div>

    <div class="overflow-x-auto">
      <table class="min-w-full bg-white border border-gray-300 rounded shadow">
        <thead class="bg-gray-100">
          <tr>
            <th class="px-4 py-2 text-left">ID</th>
            <th class="px-4 py-2 text-left">Tipo</th>
            <th class="px-4 py-2 text-left">Número</th>
            <th class="px-4 py-2 text-left">Emisión</th>
            <th class="px-4 py-2 text-left">Vencimiento</th>
          </tr>
        </thead>
        <tbody id="tabla-documentos" class="text-gray-800"></tbody>
      </table>
    </div>
  `;

        document.getElementById("btn-nuevo-documento").addEventListener("click", () => {
            document.getElementById("formulario-documento").classList.toggle("hidden");
        });

        document.getElementById("documento-form").addEventListener("submit", (e) => {
            e.preventDefault();
            const form = e.target;

            const nuevoDoc = {
                tipo: form.tipo.value,
                numero: form.numero.value,
                fechaEmision: form.fechaEmision.value,
                fechaVencimiento: form.fechaVencimiento.value
            };

            fetch("http://localhost:8080/api/documentos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(nuevoDoc)
            })
                .then(res => res.ok ? renderDocumentos() : Promise.reject("Error al registrar"))
                .catch(err => alert(err));
        });

        fetch("http://localhost:8080/api/documentos")
            .then(res => res.json())
            .then(data => {
                const tbody = document.getElementById("tabla-documentos");
                data.forEach(doc => {
                    const row = document.createElement("tr");
                    row.className = "border-t";
                    row.innerHTML = `
          <td class="px-4 py-2">${doc.idDocumento}</td>
          <td class="px-4 py-2">${doc.tipo}</td>
          <td class="px-4 py-2">${doc.numero}</td>
          <td class="px-4 py-2">${doc.fechaEmision}</td>
          <td class="px-4 py-2">${doc.fechaVencimiento}</td>
        `;
                    tbody.appendChild(row);
                });
            });
    }


    // 📑 Declaraciones
    function renderDeclaraciones() {
        document.getElementById("dashboard-root").innerHTML = `
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-bold text-gray-800">📑 Declaraciones Juradas</h2>
      <button id="btn-nueva-declaracion" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        + Registrar Declaración
      </button>
    </div>

    <div id="formulario-declaracion" class="mb-6 hidden bg-white p-4 rounded shadow">
      <h3 class="font-semibold mb-2">Nueva Declaración</h3>
      <form id="declaracion-form" class="space-y-3">
        <select name="idViajero" required class="w-full border px-3 py-2 rounded">
          <option value="">Seleccione Viajero</option>
        </select>
        <select name="estado" class="w-full border px-3 py-2 rounded">
          <option value="PENDIENTE">Pendiente</option>
          <option value="APROBADA">Aprobada</option>
          <option value="RECHAZADA">Rechazada</option>
        </select>
        <button type="submit" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Guardar</button>
      </form>
    </div>

    <div class="overflow-x-auto">
      <table class="min-w-full bg-white border border-gray-300 rounded shadow">
        <thead class="bg-gray-100">
          <tr>
            <th class="px-4 py-2 text-left">ID</th>
            <th class="px-4 py-2 text-left">Estado</th>
            <th class="px-4 py-2 text-left">ID Viajero</th>
            <th class="px-4 py-2 text-left">Nombre</th>
          </tr>
        </thead>
        <tbody id="tabla-declaraciones" class="text-gray-800"></tbody>
      </table>
    </div>
  `;

        // Toggle del formulario
        document.getElementById("btn-nueva-declaracion").addEventListener("click", () => {
            document.getElementById("formulario-declaracion").classList.toggle("hidden");
        });

        // Cargar viajeros para el select
        fetch("http://localhost:8080/api/viajeros")
            .then(res => res.json())
            .then(data => {
                const select = document.querySelector("select[name='idViajero']");
                data.forEach(v => {
                    const option = document.createElement("option");
                    option.value = v.idUsuario;
                    option.textContent = `${v.nombre} (${v.correo})`;
                    select.appendChild(option);
                });
            });

        // Enviar nueva declaración
        document.getElementById("declaracion-form").addEventListener("submit", e => {
            e.preventDefault();
            const form = e.target;
            const nuevaDecl = {
                idViajero: form.idViajero.value,
                estado: form.estado.value
            };

            fetch("http://localhost:8080/api/declaraciones", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(nuevaDecl)
            })
                .then(res => {
                    if (!res.ok) throw new Error("Error al registrar");
                    return res.json();
                })
                .then(() => renderDeclaracionesJurada())
                .catch(err => alert("Error: " + err.message));
        });

        // Obtener declaraciones
        fetch("http://localhost:8080/api/declaraciones")
            .then(res => res.json())
            .then(data => {
                const tbody = document.getElementById("tabla-declaraciones");
                data.forEach(d => {
                    const row = document.createElement("tr");
                    row.className = "border-t";
                    row.innerHTML = `
          <td class="px-4 py-2">${d.id}</td>
          <td class="px-4 py-2">${d.estado}</td>
          <td class="px-4 py-2">${d.idViajero}</td>
          <td class="px-4 py-2">${d.nombreViajero ?? "-"}</td>
        `;
                    tbody.appendChild(row);
                });
            });
    }


    // 📈 Reportes
    function renderReportes() {
        document.getElementById("dashboard-root").innerHTML = `
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-bold text-gray-800">📈 Reportes Estadísticos</h2>
      <button id="btn-nuevo-reporte" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        + Registrar Reporte
      </button>
    </div>

    <div id="formulario-reporte" class="mb-6 hidden bg-white p-4 rounded shadow">
      <form id="reporte-form" class="space-y-3">
        <input type="text" name="tipo" placeholder="Tipo de reporte" required class="w-full border px-3 py-2 rounded" />
        <input type="date" name="fechaGeneracion" required class="w-full border px-3 py-2 rounded" />
        <button type="submit" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Guardar</button>
      </form>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <div>
        <h3 class="font-semibold mb-2">Distribución por tipo</h3>
        <canvas id="grafico-tipo"></canvas>
      </div>
      <div>
        <h3 class="font-semibold mb-2">Reportes por fecha</h3>
        <canvas id="grafico-fechas"></canvas>
      </div>
    </div>

    <div class="overflow-x-auto">
      <table class="min-w-full bg-white border border-gray-300 rounded shadow">
        <thead class="bg-gray-100">
          <tr>
            <th class="px-4 py-2 text-left">ID</th>
            <th class="px-4 py-2 text-left">Tipo</th>
            <th class="px-4 py-2 text-left">Fecha Generación</th>
          </tr>
        </thead>
        <tbody id="tabla-reportes" class="text-gray-800"></tbody>
      </table>
    </div>
  `;

        // Mostrar / ocultar formulario
        document.getElementById("btn-nuevo-reporte").addEventListener("click", () => {
            document.getElementById("formulario-reporte").classList.toggle("hidden");
        });

        // Enviar nuevo reporte
        document.getElementById("reporte-form").addEventListener("submit", e => {
            e.preventDefault();
            const form = e.target;
            const nuevoReporte = {
                tipo: form.tipo.value,
                fechaGeneracion: form.fechaGeneracion.value
            };

            fetch("http://localhost:8080/api/reportes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(nuevoReporte)
            })
                .then(res => {
                    if (!res.ok) throw new Error("Error al registrar");
                    return res.json();
                })
                .then(() => renderReportes())
                .catch(err => alert("Error: " + err.message));
        });

        // Cargar y renderizar tabla + gráficos
        fetch("http://localhost:8080/api/reportes")
            .then(res => res.json())
            .then(data => {
                const tbody = document.getElementById("tabla-reportes");
                const tipos = {};
                const fechas = {};

                data.forEach(rep => {
                    const row = document.createElement("tr");
                    row.className = "border-t";
                    row.innerHTML = `
          <td class="px-4 py-2">${rep.idReporte}</td>
          <td class="px-4 py-2">${rep.tipo}</td>
          <td class="px-4 py-2">${rep.fechaGeneracion}</td>
        `;
                    tbody.appendChild(row);

                    tipos[rep.tipo] = (tipos[rep.tipo] || 0) + 1;
                    fechas[rep.fechaGeneracion] = (fechas[rep.fechaGeneracion] || 0) + 1;
                });

                // Gráfico de tipos
                new Chart(document.getElementById("grafico-tipo"), {
                    type: "pie",
                    data: {
                        labels: Object.keys(tipos),
                        datasets: [{
                            data: Object.values(tipos),
                            backgroundColor: ["#60a5fa", "#10b981", "#facc15", "#f87171"]
                        }]
                    },
                    options: {
                        plugins: { legend: { position: "bottom" } }
                    }
                });

                // Gráfico de fechas
                new Chart(document.getElementById("grafico-fechas"), {
                    type: "bar",
                    data: {
                        labels: Object.keys(fechas),
                        datasets: [{
                            label: "Cantidad de Reportes",
                            data: Object.values(fechas),
                            backgroundColor: "#6366f1"
                        }]
                    },
                    options: {
                        scales: { y: { beginAtZero: true } }
                    }
                });
            });
    }


});
