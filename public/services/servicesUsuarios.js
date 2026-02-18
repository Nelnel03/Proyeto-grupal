import { getDatos, postDatos, getDatosPorId } from "./apis.js";

const endpoint = "usuarios";

const endpointSesion = "sesionActiva";

function obtenerUsuarios() {
    return getDatos(endpoint);
}

async function registrarUsuario(data) {
    if (!data.nombre || !data.correo || !data.password || !data.telefono) {
        throw new Error("Todos los campos (nombre, correo, contraseña, teléfono) son obligatorios");
    }

    const usuarios = await obtenerUsuarios();
    const existe = usuarios.some(u => u.correo === data.correo);

    if (existe) {
        throw new Error("El correo ya está registrado");
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

    if (usuarioEncontrado) {
        // Guardar sesión en base de datos
        await fetch(`http://localhost:3000/${endpointSesion}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                usuarioId: usuarioEncontrado.id,
                rol: "usuario"
            })
        });
        return usuarioEncontrado;
    }

    throw new Error("Correo o contraseña incorrectos");
}

async function obtenerSesionActiva() {
    const response = await fetch(`http://localhost:3000/${endpointSesion}`);
    if (!response.ok) return null;
    return await response.json();
}

async function cerrarSesion() {
    await fetch(`http://localhost:3000/${endpointSesion}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            usuarioId: null,
            rol: null
        })
    });
}

function obtenerUsuarioPorId(id) {
    return getDatosPorId(endpoint, id);
}

async function promoverAdmin(usuario) {
    const response = await fetch("http://localhost:3000/administradores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            id: `adm-${usuario.id}`,
            nombre: usuario.nombre,
            correo: usuario.correo,
            password: usuario.password
        })
    });
    if (!response.ok) {
        throw new Error("Error al promover usuario a administrador");
    }
    return await response.json();
}

export { obtenerUsuarios, registrarUsuario, iniciarSesion, obtenerSesionActiva, cerrarSesion, obtenerUsuarioPorId, promoverAdmin };
