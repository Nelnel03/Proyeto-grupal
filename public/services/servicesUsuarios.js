import { getDatos, postDatos } from "./getPostPutDelete.js";

const endpoint = "usuarios";

function obtenerUsuarios() {
    return getDatos(endpoint);
}

async function registrarUsuario(data) {
    if (!data.nombre || !data.correo || !data.password || !data.telefono) {
        throw new Error("Todos los campos (nombre, correo, contraseña, teléfono) son obligatorios");
    }
    return await postDatos(endpoint, data);
}

async function iniciarSesion(email, password) {
    const usuarios = await obtenerUsuarios();

    let usuarioEncontrado = null;

    for (let i = 0; i < usuarios.length; i++) {
        if (usuarios[i].correo === email && usuarios[i].password === password) {
            usuarioEncontrado = usuarios[i];
            break;
        }
    }

    if (usuarioEncontrado === null) {
        throw new Error("Correo o contraseña incorrectos");
    }

    return usuarioEncontrado;
}

export { obtenerUsuarios, registrarUsuario, iniciarSesion };
