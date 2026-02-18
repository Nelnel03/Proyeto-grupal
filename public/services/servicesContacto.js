import { postDatos, getDatos } from "./apis.js";

const endpoint = "mensajesContacto";

async function enviarMensaje(data) {
    if (!data.nombre || !data.apellido || !data.cedula || !data.telefono || !data.correo || !data.comentario) {
        throw new Error("Por favor completa todos los campos requeridos.");
    }
    return await postDatos(endpoint, data);
}

async function obtenerMensajes() {
    return await getDatos(endpoint);
}

async function actualizarMensaje(id, data) {
    const response = await fetch(`http://localhost:3000/${endpoint}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        throw new Error("Error al actualizar el mensaje");
    }
    return await response.json();
}

export { enviarMensaje, obtenerMensajes, actualizarMensaje };
