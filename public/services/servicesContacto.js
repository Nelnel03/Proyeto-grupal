import { postDatos, getDatos, patchDatos } from "./apis.js";

const endpoint = "mensajesContacto";

async function enviarMensaje(data) {
    if (!data.cedula || !data.comentario) {
        throw new Error("Por favor completa todos los campos requeridos.");
    }
    return await postDatos(endpoint, data);
}






async function obtenerMensajes() {
    return await getDatos(endpoint);
}





async function actualizarMensaje(id, data) {
    return await patchDatos(endpoint, id, data);
}








export { enviarMensaje, obtenerMensajes, actualizarMensaje };
