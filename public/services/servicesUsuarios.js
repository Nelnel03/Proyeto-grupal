import { getDatos, postDatos, getDatosPorId, BASE_URL } from "./apis.js";

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
    if (!data.nombre || !data.correo || !data.password || !data.telefono || !data.cedula) {
        throw new Error("Todos los campos (nombre, correo, contraseña, teléfono, cédula) son obligatorios");
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

    const nuevoUsuario = {
        ...data,
        rol: "ciudadano"
    };

    return await postDatos(endpoint, nuevoUsuario);
}










async function iniciarSesion(email, password) {
    const usuarios = await obtenerUsuarios();
    const emailNormalizado = email.trim().toLowerCase();
    const passwordNormalizado = password.trim();


    let usuarioEncontrado = null;
    for (let i = 0; i < usuarios.length; i++) {
        if (usuarios[i].correo === email && usuarios[i].password === password) {
            usuarioEncontrado = usuarios[i];
            break;
        }
    }


    if (usuarioEncontrado) {
        await fetch(`${BASE_URL}/${endpointSesion}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                usuarioId: usuarioEncontrado.id,
                rol: usuarioEncontrado.rol
            })
        });

        // Guardar en localStorage para acceso rápido y persistencia de UI
        localStorage.setItem("usuarioActivo", JSON.stringify({
            id: usuarioEncontrado.id,
            nombre: usuarioEncontrado.nombre,
            apellido: usuarioEncontrado.apellido,
            cedula: usuarioEncontrado.cedula,
            correo: usuarioEncontrado.correo,
            rol: usuarioEncontrado.rol
        }));

        return usuarioEncontrado;
    }

    throw new Error("Correo o contraseña incorrectos");
}







async function obtenerSesionActiva() {
    const response = await fetch(`${BASE_URL}/${endpointSesion}`);
    if (!response.ok) return null;
    return await response.json();
}







async function cerrarSesion() {
    await fetch(`${BASE_URL}/${endpointSesion}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            usuarioId: null,
            rol: null
        })
    });
    // Limpiar localStorage
    localStorage.removeItem("usuarioActivo");
    return true;
}







function obtenerUsuarioPorId(id) {
    return getDatosPorId(endpoint, id);
}








async function promoverAdmin(usuario) {
    const response = await fetch(`${BASE_URL}/administradores`, {
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
    const response = await fetch(`${BASE_URL}/${endpoint}/${id}`, {
        method: "DELETE"
    });

    if (!response.ok) {
        throw new Error("Error al eliminar el usuario original");
    }
    return true;
}




async function actualizarUsuario(id, data) {
    const response = await fetch(`${BASE_URL}/${endpoint}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error("Error al actualizar el usuario");
    }
    return await response.json();
}


export {
    obtenerUsuarios,
    registrarUsuario,
    iniciarSesion,
    obtenerSesionActiva,
    cerrarSesion,
    obtenerUsuarioPorId,
    promoverAdmin,
    actualizarUsuario,
    eliminarUsuario
};
