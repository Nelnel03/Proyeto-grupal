import { obtenerReportes } from "../services/servicesReportes.js";
import { obtenerFinanciamientos, crearFinanciamiento } from "../services/servicesFinanciamiento.js";

// Elementos del DOM
const tablaReportes = document.getElementById("tablaReportes");
const tablaSolicitudes = document.getElementById("tablaSolicitudes");
const btnVerReportes = document.getElementById("btnVerReportes");
const btnMisSolicitudes = document.getElementById("btnMisSolicitudes");
const seccionReportes = document.getElementById("seccionReportes");
const seccionSolicitudes = document.getElementById("seccionSolicitudes");

const formSolicitud = document.getElementById("formSolicitud");
const solReporteId = document.getElementById("solReporteId");
const solTipo = document.getElementById("solTipo");
const solNombre = document.getElementById("solNombre");
const solDescripcion = document.getElementById("solDescripcion");
const solMonto = document.getElementById("solMonto");
const solResponsable = document.getElementById("solResponsable");
const camposVial = document.getElementById("camposVial");
const camposServicio = document.getElementById("camposServicio");

const btnGuardarSolicitud = document.getElementById("btnGuardarSolicitud");
const btnCancelarSolicitud = document.getElementById("btnCancelarSolicitud");
const btnLogout = document.getElementById("btnLogout");

// Filtros
const filtroTipo = document.getElementById("filtroTipo");
const filtroTexto = document.getElementById("filtroTexto");
const btnLimpiarFiltros = document.getElementById("btnLimpiarFiltros");

// Navegación
btnVerReportes.addEventListener("click", () => {
    activarSeccion(seccionReportes, btnVerReportes);
    cargarReportes();
});

btnMisSolicitudes.addEventListener("click", () => {
    activarSeccion(seccionSolicitudes, btnMisSolicitudes);
    cargarSolicitudes();
});

function activarSeccion(seccion, boton) {
    document.querySelectorAll(".seccion").forEach(s => s.classList.remove("activa"));
    document.querySelectorAll(".sidebar button").forEach(b => b.classList.remove("active"));
    seccion.classList.add("activa");
    boton.classList.add("active");
}

// Lógica de reportes
async function cargarReportes() {
    const reportes = await obtenerReportes();
    const tipo = filtroTipo.value;
    const texto = filtroTexto.value.toLowerCase().trim();

    const reportesFiltrados = reportes.filter(rep => {
        const coincideTipo = !tipo || rep.tipo === tipo;
        const coincideTexto = !texto ||
            rep.ubicacion.toLowerCase().includes(texto) ||
            rep.descripcion.toLowerCase().includes(texto);
        return coincideTipo && coincideTexto;
    });

    tablaReportes.innerHTML = "";
    reportesFiltrados.forEach(rep => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${rep.id}</td>
            <td>${rep.tipo}</td>
            <td>${rep.descripcion}</td>
            <td>${rep.ubicacion}</td>
            <td><span class="estado ${rep.estado.toLowerCase()}">${rep.estado}</span></td>
            <td>
                <button class="btn btn-crear" onclick="iniciarSolicitud('${rep.id}', '${rep.descripcion}')">Solicitar Proyecto</button>
            </td>
        `;
        tablaReportes.appendChild(tr);
    });
}

// Eventos de filtros
filtroTipo.addEventListener("change", cargarReportes);
filtroTexto.addEventListener("input", cargarReportes);
btnLimpiarFiltros.addEventListener("click", () => {
    filtroTipo.value = "";
    filtroTexto.value = "";
    cargarReportes();
});

window.iniciarSolicitud = (id, desc) => {
    activarSeccion(seccionSolicitudes, btnMisSolicitudes);
    formSolicitud.style.display = "block";
    solReporteId.value = id;
    solDescripcion.value = `Basado en el reporte ${id}: ${desc}`;
    solNombre.focus();
};

// Lógica de formulario
solTipo.addEventListener("change", () => {
    if (solTipo.value === "vial") {
        camposVial.style.display = "block";
        camposServicio.style.display = "none";
    } else {
        camposVial.style.display = "none";
        camposServicio.style.display = "block";
    }
});

btnCancelarSolicitud.addEventListener("click", () => {
    formSolicitud.style.display = "none";
    limpiarFormulario();
});

function limpiarFormulario() {
    solReporteId.value = "";
    solNombre.value = "";
    solDescripcion.value = "";
    solMonto.value = "";
    solResponsable.value = "";
}

btnGuardarSolicitud.addEventListener("click", async () => {
    const data = {
        reporteId: solReporteId.value,
        tipo: solTipo.value,
        nombre: solNombre.value,
        descripcion: solDescripcion.value,
        monto_solicitado: solTipo.value === "vial" ? parseFloat(solMonto.value) : 0,
        responsable: solTipo.value === "servicio" ? solResponsable.value : "Admin Vial"
    };

    if (!data.nombre || !data.descripcion) {
        Swal.fire("Error", "Por favor completa el nombre y descripción", "error");
        return;
    }

    try {
        await crearFinanciamiento(data);
        Swal.fire("Éxito", "Solicitud enviada al administrador", "success");
        formSolicitud.style.display = "none";
        limpiarFormulario();
        cargarSolicitudes();
    } catch (error) {
        console.error(error);
        Swal.fire("Error", "No se pudo enviar la solicitud", "error");
    }
});

// Lógica de solicitudes
async function cargarSolicitudes() {
    const solicitudes = await obtenerFinanciamientos();
    tablaSolicitudes.innerHTML = "";
    // Nota: Deberíamos filtrar por el ID del funcionario actual si tuviéramos esa info persistida
    solicitudes.forEach(sol => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${sol.fecha_solicitud}</td>
            <td>${sol.nombre}</td>
            <td>${sol.tipo.toUpperCase()}</td>
            <td><span class="estado ${sol.estado.toLowerCase()}">${sol.estado}</span></td>
            <td>${sol.tipo === "vial" ? "₡" + sol.monto_solicitado : "N/A"}</td>
            <td>${sol.fecha_resolucion ? sol.estado + " el " + sol.fecha_resolucion : "Pendiente"}</td>
        `;
        tablaSolicitudes.appendChild(tr);
    });
}

btnLogout.addEventListener("click", () => {
    window.location.href = "login.html";
});

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
    cargarReportes();
});
