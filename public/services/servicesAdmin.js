import { getDatos } from "./apis.js";

const endpoint = "administradores";

async function obtenerAdmins() {
    return await getDatos(endpoint);
}

async function iniciarSesionAdmin(correo, password) {
    const admins = await obtenerAdmins();

    let adminEncontrado = null;

    for (let i = 0; i < admins.length; i++) {
        if (admins[i].correo === correo && admins[i].password === password) {
            adminEncontrado = admins[i];
            break;
        }
    }

    return adminEncontrado;
}

export { obtenerAdmins, iniciarSesionAdmin };
