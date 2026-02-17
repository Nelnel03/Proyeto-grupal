import { obtenerSesionActiva, obtenerUsuarioPorId, cerrarSesion } from "../services/servicesUsuarios.js";
import { obtenerReportes } from "../services/servicesReportes.js";

const nombreUsuario = document.getElementById("nombreUsuario");
const correoUsuario = document.getElementById("correoUsuario");
const telefonoUsuario = document.getElementById("telefonoUsuario");
const contenedorReportes = document.getElementById("contenedorReportes");
const btnCerrarSesion = document.getElementById("btnCerrarSesion");

async function cargarPerfil() {
    try {
        const sesion = await obtenerSesionActiva();

        if (!sesion || !sesion.usuarioId) {
            window.location.href = "../pages/login.html";
            return;
        }

        if (sesion.rol === 'admin') {
            window.location.href = "../pages/admin.html";
            return;
        }

        const usuario = await obtenerUsuarioPorId(sesion.usuarioId);
        if (usuario) {
            nombreUsuario.textContent = `${usuario.nombre} ${usuario.apellido}`;
            correoUsuario.textContent = usuario.correo;
            telefonoUsuario.textContent = usuario.telefono;
        }

        const reportes = await obtenerReportes();
        // Filtrar reportes usando el correo del usuario, ya que los reportes actuales no tienen ID de usuario.
        // En una implementación real, se usaría el ID. Para mantener compatibilidad con reportes viejos,
        // asumiremos que se relacionan de alguna manera o mostraremos todos si no hay filtro claro, 
        // pero el plan era asociarlos. Por ahora, mostraré los reportes que coincidan con el correo si existiera ese campo,
        // o implementaré la lógica de guardar el ID en nuevos reportes.
        // Re-leendo el plan: "Filter reports to show only those belonging to the logged-in user".
        // Los reportes en baseDatos.json NO tienen usuarioId. Necesito actualizar servicesReportes.js para guardar usuarioId.

        // Muestro los reportes que tengan el usuarioId coincidente.
        const misReportes = reportes.filter(r => r.usuarioId === sesion.usuarioId);

        contenedorReportes.innerHTML = "";

        if (misReportes.length === 0) {
            contenedorReportes.innerHTML = "<p>No has realizado ningún reporte.</p>";
            return;
        }

        misReportes.forEach(reporte => {
            const div = document.createElement("div");
            div.className = "tarjeta-reporte";
            div.innerHTML = `
                <h3>${reporte.tipo}</h3>
                <p><strong>Descripción:</strong> ${reporte.descripcion}</p>
                <p><strong>Ubicación:</strong> ${reporte.ubicacion}</p>
                <p><strong>Estado:</strong> <span class="estado-${(reporte.estado || "pendiente").toLowerCase()}">${reporte.estado || "Pendiente"}</span></p>
                <p><small>Fecha: ${reporte.fecha}</small></p>
            `;
            contenedorReportes.appendChild(div);
        });

    } catch (error) {
        console.error("Error al cargar perfil:", error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al cargar tu perfil.'
        });
    }
}

btnCerrarSesion.addEventListener("click", async () => {
    await cerrarSesion();
    window.location.href = "../pages/login.html";
});

cargarPerfil();
