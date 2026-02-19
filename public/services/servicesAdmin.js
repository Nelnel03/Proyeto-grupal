import { getDatos, BASE_URL } from "./apis.js";

const endpoint = "administradores";

async function obtenerAdmins() {
    return await getDatos(endpoint);
}





const endpointSesion = "sesionActiva";

async function iniciarSesionAdmin(correo, password) {
    const admins = await obtenerAdmins();
    const emailNormalizado = correo.trim().toLowerCase();
    const passwordNormalizado = password.trim();

    const adminEncontrado = admins.find(a =>
        a.correo.trim().toLowerCase() === emailNormalizado &&
        a.password.trim() === passwordNormalizado
    );

    if (adminEncontrado) {
        await fetch(`${BASE_URL}/${endpointSesion}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                usuarioId: adminEncontrado.id,
                rol: "admin"
            })
        });

        // Guardar en localStorage
        localStorage.setItem("usuarioActivo", JSON.stringify({
            id: adminEncontrado.id,
            nombre: adminEncontrado.nombre,
            apellido: adminEncontrado.apellido || "",
            cedula: adminEncontrado.cedula || "N/A",
            correo: adminEncontrado.correo,
            rol: "admin"
        }));

        return adminEncontrado;
    }

    return null;
}





export { obtenerAdmins, iniciarSesionAdmin };
