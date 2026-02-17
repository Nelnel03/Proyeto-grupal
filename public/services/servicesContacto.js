import { postDatos, getDatos } from "./apis.js";

const endpoint = "mensajesContacto";

async function enviarMensaje(data) {
    if (!data.nombre || !data.apellido || !data.cedula || !data.correo || !data.comentario) {
        throw new Error("Por favor completa todos los campos requeridos.");
    }
    return await postDatos(endpoint, data);
}

function obtenerMensajes() {
    return getDatos(endpoint);
}

export { enviarMensaje, obtenerMensajes };
