

import { obtenerProyectos } from "../services/servicesProyectos.js";
import { obtenerServicios } from "../services/servicesServicios.js";
import { crearReporte } from "../services/servicesReportes.js";

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
            tarjeta.className = "tarjeta";
            tarjeta.innerHTML = `
                <h3>${proyecto.nombre}</h3>
                <p>${proyecto.descripcion || "Sin descripción"}</p>
                <p><strong>Presupuesto:</strong> ₡${Number(proyecto.presupuesto).toLocaleString()}</p>
                <p><strong>Fecha de inicio:</strong> ${proyecto.fechaInicio}</p>
                <span class="estado">${proyecto.estado}</span>
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
            tarjeta.className = "tarjeta";
            tarjeta.innerHTML = `
                <h3>${servicio.tipo}</h3>
                <p>${servicio.descripcion || "Sin descripción"}</p>
                <p><strong>Responsable:</strong> ${servicio.responsable}</p>
                <span class="estado">${servicio.estado}</span>
            `;
            contenedorServicios.appendChild(tarjeta);
        });

    } catch (error) {
        contenedorServicios.innerHTML = `<p class="mensajeVacio">Error al cargar servicios.</p>`;
    }
}

btnEnviarReporte.addEventListener("click", async () => {
    if (!reporteTipo.value || !reporteDescripcion.value || !reporteUbicacion.value) {
        alert("Por favor, completa todos los campos del reporte.");
        return;
    }

    const data = {
        tipo: reporteTipo.value,
        descripcion: reporteDescripcion.value,
        ubicacion: reporteUbicacion.value
    };

    try {
        await crearReporte(data);
        alert("¡Reporte enviado con éxito! La municipalidad lo revisará pronto.");

        // Limpiar formulario
        reporteTipo.value = "";
        reporteDescripcion.value = "";
        reporteUbicacion.value = "";
    } catch (error) {
        alert("Error al enviar reporte: " + error.message);
    }
});

cargarProyectos();
cargarServicios();
