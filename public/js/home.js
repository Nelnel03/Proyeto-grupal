

import { obtenerProyectos } from "../services/servicesProyectos.js";
import { obtenerServicios } from "../services/servicesServicios.js";
import { crearReporte } from "../services/servicesReportes.js";
import { obtenerSesionActiva, cerrarSesion } from "../services/servicesUsuarios.js";

// Hacer disponible cerrarSesion globalmente para el onclick en HTML
window.cerrarSesion = async () => {
    await cerrarSesion();
    window.location.href = "../pages/login.html";
};

const contenedorProyectos = document.getElementById("contenedorProyectos");
const contenedorServicios = document.getElementById("contenedorServicios");
const reporteTipo = document.getElementById("reporteTipo");
const reporteDescripcion = document.getElementById("reporteDescripcion");
const reporteUbicacion = document.getElementById("reporteUbicacion");
const btnEnviarReporte = document.getElementById("btnEnviarReporte");


async function cargarProyectos() {
    try {
        const proyectos = await obtenerProyectos();
        contenedorProyectos.innerHTML = "";

        if (proyectos.length === 0) {
            contenedorProyectos.innerHTML = `<p class="mensajeVacio">No hay proyectos publicados actualmente.</p>`;
            return;
        }

        proyectos.forEach((proyecto) => {
            const tarjeta = document.createElement("div");
            tarjeta.className = "tarjeta-proyecto";
            tarjeta.innerHTML = `
                <div class="tarjeta-titulo">${proyecto.nombre}</div>
                <div class="tarjeta-body">${proyecto.descripcion ? proyecto.descripcion.substring(0, 100) + '...' : "Sin descripción"}</div>
                <div class="tarjeta-footer">
                    <span class="estado-badge">${proyecto.estado}</span>
                    <button class="btn-detalles" onclick="verDetallesProyecto('${proyecto.id}')">Más detalles</button>
                </div>
            `;
            contenedorProyectos.appendChild(tarjeta);
        });

    } catch (error) {
        contenedorProyectos.innerHTML = `<p class="mensajeVacio">Error al cargar proyectos.</p>`;
    }
}

async function cargarServicios() {
    try {
        const servicios = await obtenerServicios();
        contenedorServicios.innerHTML = "";

        if (servicios.length === 0) {
            contenedorServicios.innerHTML = `<p class="mensajeVacio">No hay servicios publicados actualmente.</p>`;
            return;
        }

        servicios.forEach((servicio) => {
            const tarjeta = document.createElement("div");
            tarjeta.className = "tarjeta-servicio";
            tarjeta.innerHTML = `
                <div class="tarjeta-titulo">${servicio.tipo}</div>
                <div class="tarjeta-body">${servicio.descripcion ? servicio.descripcion.substring(0, 100) + '...' : "Sin descripción"}</div>
                <div class="tarjeta-footer">
                    <span class="estado-badge">${servicio.estado}</span>
                    <button class="btn-detalles" onclick="verDetallesServicio('${servicio.id}')">Más detalles</button>
                </div>
            `;
            contenedorServicios.appendChild(tarjeta);
        });

    } catch (error) {
        contenedorServicios.innerHTML = `<p class="mensajeVacio">Error al cargar servicios.</p>`;
    }
}

btnEnviarReporte.addEventListener("click", async () => {
    if (!reporteTipo.value || !reporteDescripcion.innerText.trim() || !reporteUbicacion.value) {
        Swal.fire({
            icon: 'warning',
            title: 'Campos incompletos',
            text: "Por favor, completa todos los campos del reporte."
        });
        return;
    }

    const sesion = await obtenerSesionActiva();
    if (!sesion || !sesion.usuarioId) {
        Swal.fire({
            icon: 'warning',
            title: 'Debe iniciar sesión',
            text: 'Para enviar un reporte, primero debe iniciar sesión.'
        }).then(() => {
            window.location.href = "../pages/login.html";
        });
        return;
    }

    const data = {
        tipo: reporteTipo.value,
        descripcion: reporteDescripcion.innerText.trim(),
        ubicacion: reporteUbicacion.value,
        usuarioId: sesion.usuarioId
    };

    try {
        await crearReporte(data);
        Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: "¡Reporte enviado con éxito! La municipalidad lo revisará pronto.",
            timer: 3000,
            showConfirmButton: false
        });


        reporteTipo.value = "";
        reporteDescripcion.innerText = "";
        reporteUbicacion.value = "";
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: "Error al enviar reporte: " + error.message
        });
    }
});

// Detalle de Proyectos
window.verDetallesProyecto = async (id) => {
    try {
        const proyectos = await obtenerProyectos();
        const p = proyectos.find(item => String(item.id) === String(id));
        if (!p) return;

        Swal.fire({
            title: p.nombre,
            html: `
                <div class="detalle-modal" style="text-align: left;">
                    <p><strong>Descripción:</strong><br>${p.descripcion || 'Sin descripción'}</p>
                    <hr>
                    <p><strong>Presupuesto Asignado:</strong> ₡${Number(p.presupuesto).toLocaleString()}</p>
                    <p><strong>Fecha de Inicio:</strong> ${p.fechaInicio}</p>
                    <p><strong>Estado Actual:</strong> <span class="estado-badge">${p.estado}</span></p>
                </div>
            `,
            confirmButtonText: 'Cerrar',
            confirmButtonColor: '#3498db'
        });
    } catch (e) {
        console.error(e);
    }
};

// Detalle de Servicios
window.verDetallesServicio = async (id) => {
    try {
        const servicios = await obtenerServicios();
        const s = servicios.find(item => String(item.id) === String(id));
        if (!s) return;

        Swal.fire({
            title: s.tipo,
            html: `
                <div class="detalle-modal" style="text-align: left;">
                    <p><strong>Descripción del Servicio:</strong><br>${s.descripcion || 'Sin descripción'}</p>
                    <hr>
                    <p><strong>Responsable / Entidad:</strong> ${s.responsable}</p>
                    <p><strong>Fecha de Inicio:</strong> ${s.fechaInicio || 'TBD'}</p>
                    <p><strong>Estado:</strong> <span class="estado-badge">${s.estado}</span></p>
                </div>
            `,
            confirmButtonText: 'Cerrar',
            confirmButtonColor: '#2ecc71'
        });
    } catch (e) {
        console.error(e);
    }
};

// Lógica para secciones expandibles
document.querySelectorAll(".card-expandible").forEach(card => {
    const header = card.querySelector(".card-expandible-header");

    header.addEventListener("click", (e) => {
        card.classList.toggle("expanded");

        // Cambiar texto del botón según el estado
        const btn = card.querySelector(".btn-toggle-expand");
        const isExpanded = card.classList.contains("expanded");

        if (card.id === "seccionProyectos") {
            btn.innerHTML = isExpanded ? `Ocultar Proyectos <span class="icon-arrow">▼</span>` : `Ver Proyectos <span class="icon-arrow">▼</span>`;
        } else if (card.id === "seccionServicios") {
            btn.innerHTML = isExpanded ? `Ocultar Servicios <span class="icon-arrow">▼</span>` : `Ver Servicios <span class="icon-arrow">▼</span>`;
        }
    });
});

cargarProyectos();
cargarServicios();
