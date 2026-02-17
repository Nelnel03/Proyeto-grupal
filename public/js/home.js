

import { obtenerProyectos } from "../services/servicesProyectos.js";
import { obtenerServicios } from "../services/servicesServicios.js";
import { crearReporte } from "../services/servicesReportes.js";
import { obtenerSesionActiva } from "../services/servicesUsuarios.js";

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
                <div class="tarjeta-body">${proyecto.descripcion || "Sin descripción"}</div>
                <div class="tarjeta-footer">
                    <p>Presupuesto: ₡${Number(proyecto.presupuesto).toLocaleString()}</p>
                    <p>Fecha de inicio: ${proyecto.fechaInicio}</p>
                    <span class="estado-badge">${proyecto.estado}</span>
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
                <div class="tarjeta-body">${servicio.descripcion || "Sin descripción"}</div>
                <div class="tarjeta-footer">
                    <p>Responsable: ${servicio.responsable}</p>
                    <span class="estado-badge">${servicio.estado}</span>
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

cargarProyectos();
cargarServicios();
