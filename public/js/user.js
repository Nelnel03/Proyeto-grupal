
import { obtenerReportes } from "../services/servicesReportes.js";


const tablaReportesUsuario = document.getElementById("tablaReportesUsuario");

async function cargarReportes() {
    try {
        const reportes = await obtenerReportes();
        tablaReportesUsuario.innerHTML = "";

        if (reportes.length === 0) {
            tablaReportesUsuario.innerHTML = `<tr><td colspan="5" class="mensaje-vacio">No hay reportes registrados aún.</td></tr>`;
            return;
        }

        reportes.forEach((reporte) => {
            const fila = document.createElement("tr");

            let claseEstado = "estado-pendiente";
            let textoEstado = reporte.estado;

            if (reporte.estado === "En Proceso") {
                claseEstado = "estado-en-proceso";
            } else if (reporte.estado === "Resuelto") {
                claseEstado = "estado-resuelto";
            }

            fila.innerHTML = `
                <td>${reporte.tipo}</td>
                <td>${reporte.descripcion}</td>
                <td>${reporte.ubicacion}</td>
                <td>${reporte.fecha}</td>
                <td><span class="estado-badge ${claseEstado}">${textoEstado}</span></td>
            `;
            tablaReportesUsuario.appendChild(fila);
        });

    } catch (error) {
        tablaReportesUsuario.innerHTML = `<tr><td colspan="5" class="mensaje-vacio">Error al cargar reportes.</td></tr>`;
    }
}

cargarReportes();
