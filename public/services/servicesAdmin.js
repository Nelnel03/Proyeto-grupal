import { getDatos } from "./apis.js";

const endpoint = "administradores";

async function obtenerAdmins() {
    return await getDatos(endpoint);
}

const endpointSesion = "sesionActiva";

async function iniciarSesionAdmin(correo, password) {
    const admins = await obtenerAdmins();
    let adminEncontrado = null;

    for (let i = 0; i < admins.length; i++) {
        if (admins[i].correo === correo && admins[i].password === password) {
            adminEncontrado = admins[i];
            break;
        }
    }

    if (adminEncontrado) {
        // Guardar sesión de admin
        await fetch(`http://localhost:3000/${endpointSesion}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                usuarioId: adminEncontrado.id,
                rol: "admin"
            })
        });
        return adminEncontrado;
    }

    return null;
}

export { obtenerAdmins, iniciarSesionAdmin };
