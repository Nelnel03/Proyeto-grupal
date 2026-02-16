import { getDatos, getDatosPorId, postDatos, patchDatos, deleteDatos } from "./getPostPutDelete.js";

const endpoint = "proyectos";

async function obtenerProyectos() {
    return await getDatos(endpoint);
}

async function obtenerProyectoPorId(id) {
    return await getDatosPorId(endpoint, id);
}

async function crearProyecto(data) {
    if (!data.nombre || !data.presupuesto || !data.fechaInicio) {
        throw new Error("Nombre, presupuesto y fecha de inicio son obligatorios");
    }

    let estadoProyecto = "Planificación";
    if (data.estado) {
        estadoProyecto = data.estado;
    }

    const nuevoProyecto = {
        nombre: data.nombre,
        presupuesto: data.presupuesto,
        fechaInicio: data.fechaInicio,
        descripcion: data.descripcion,
        estado: estadoProyecto
    };

    return await postDatos(endpoint, nuevoProyecto);
}

async function actualizarProyecto(id, data) {
    return await patchDatos(endpoint, id, data);
}

async function eliminarProyecto(id) {
    return await deleteDatos(endpoint, id);
}

export { obtenerProyectos, obtenerProyectoPorId, crearProyecto, actualizarProyecto, eliminarProyecto };
