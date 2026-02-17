import { obtenerReportes } from "../services/servicesReportes.js";
import { obtenerSesionActiva } from "../services/servicesUsuarios.js";

const tablaReportesUsuario = document.getElementById("tablaReportesUsuario");

async function cargarReportes() {
    const sesion = await obtenerSesionActiva();

    if (!sesion || !sesion.usuarioId) {
        Swal.fire({
            icon: 'error',
            title: 'Acceso denegado',
            text: 'Debes iniciar sesión para ver tus reportes.'
        }).then(() => {
            window.location.href = "../pages/login.html";
        });
        return;
    }

    try {
        const reportes = await obtenerReportes();
        tablaReportesUsuario.innerHTML = "";

        // Filtrar reportes del usuario actual
        const misReportes = reportes.filter(r => r.usuarioId === sesion.usuarioId);

        if (misReportes.length === 0) {
            tablaReportesUsuario.innerHTML = `<tr><td colspan="5" class="mensaje-vacio">No has realizado reportes aún.</td></tr>`;
            return;
        }

        misReportes.forEach((reporte) => {
            const fila = document.createElement("tr");

            let claseEstado = "estado-pendiente";
            let textoEstado = reporte.estado || "Pendiente";

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
        console.error("Error:", error);
        tablaReportesUsuario.innerHTML = `<tr><td colspan="5" class="mensaje-vacio">Error al cargar reportes.</td></tr>`;
    }
}

cargarReportes();
