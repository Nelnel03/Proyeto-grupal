import { getDatos, postDatos, getDatosPorId } from "./apis.js";

const endpoint = "usuarios";

const endpointSesion = "sesionActiva";

const validarEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

function obtenerUsuarios() {
    return getDatos(endpoint);
}

async function registrarUsuario(data) {
    if (!data.nombre || !data.correo || !data.password || !data.telefono) {
        throw new Error("Todos los campos (nombre, correo, contraseña, teléfono) son obligatorios");
    }

    if (!validarEmail(data.correo)) {
        throw new Error("El formato del correo electrónico no es válido");
    }

    if (data.password.length < 8) {
        throw new Error("La contraseña debe tener al menos 8 caracteres");
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
            localStorage.setItem("usuarioLogueado", JSON.stringify(usuarioEncontrado))
            break;
        }
    }

    if (usuarioEncontrado) {
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
    localStorage.removeItem("usuarioLogueado")
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
        throw new Error("Error al crear el perfil de administrador");
    }

    await eliminarUsuario(usuario.id);

    return await response.json();
}

async function eliminarUsuario(id) {
    const response = await fetch(`http://localhost:3000/${endpoint}/${id}`, {
        method: "DELETE"
    });

    if (!response.ok) {
        throw new Error("Error al eliminar el usuario original");
    }
    return true;
}

export { obtenerUsuarios, registrarUsuario, iniciarSesion, obtenerSesionActiva, cerrarSesion, obtenerUsuarioPorId, promoverAdmin };
