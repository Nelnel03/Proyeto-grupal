import { getDatos, getDatosPorId, postDatos, patchDatos, deleteDatos } from "./apis.js";

const endpoint = "serviciosPublicos";





async function obtenerServicios() {
    return await getDatos(endpoint);
}





async function obtenerServicioPorId(id) {
    return await getDatosPorId(endpoint, id);
}






async function crearServicio(data) {
    if (!data.tipo || !data.descripcion || !data.responsable) {
        throw new Error("Tipo, descripción y responsable son obligatorios");
    }

    let estadoServicio = "Activo";
    if (data.estado) {
        estadoServicio = data.estado;
    }

    const nuevoServicio = {
        tipo: data.tipo,
        descripcion: data.descripcion,
        responsable: data.responsable,
        fechaInicio: data.fechaInicio || new Date().toISOString().split('T')[0],
        estado: estadoServicio
    };

    return await postDatos(endpoint, nuevoServicio);
}





async function actualizarServicio(id, data) {
    return await patchDatos(endpoint, id, data);
}






async function eliminarServicio(id) {
    return await deleteDatos(endpoint, id);
}

export { obtenerServicios, obtenerServicioPorId, crearServicio, actualizarServicio, eliminarServicio };