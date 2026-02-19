import { obtenerSesionActiva, cerrarSesion } from "../services/servicesUsuarios.js";

async function actualizarNavbar() {
    const navbarLinks = document.getElementById("navbar-links");
    if (!navbarLinks) return;

    const sesion = await obtenerSesionActiva();

    if (sesion && sesion.usuarioId) {
        let perfilLink = "../pages/perfil.html";
        if (sesion.rol === 'admin') perfilLink = "../pages/admin.html";
        if (sesion.rol === 'funcionario') perfilLink = "../pages/financiamiento.html";

        navbarLinks.innerHTML = `
            <li><a href="../pages/home.html">Inicio</a></li>
            <li><a href="../pages/sobreNosotros.html">Nosotros</a></li>
            <li><a href="../pages/contacto.html">Contacto</a></li>
            <li><a href="../pages/planillas.html">Planilla</a></li>
            <li><a href="${perfilLink}">Mi Perfil</a></li>
            <li><a href="../pages/login.html" id="btnCerrarSesionShared">Cerrar Sesión</a></li>
        `;

        document.getElementById("btnCerrarSesionShared")?.addEventListener("click", async (e) => {
            e.preventDefault();
            await cerrarSesion();
            window.location.href = "../pages/home.html";
        });
    } else {
        /*
        navbarLinks.innerHTML = `
            <li><a href="../pages/home.html">Inicio</a></li>
            <li><a href="../pages/sobreNosotros.html">Nosotros</a></li>
            <li><a href="../pages/login.html">Login</a></li>
        `;
        */
    }
}

actualizarNavbar();

export { actualizarNavbar }
