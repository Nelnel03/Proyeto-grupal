import { getDatos, getDatosPorId, postDatos, patchDatos, deleteDatos } from "./getPostPutDelete.js";

const endpoint = "reportes";

async function obtenerReportes() {
    return await getDatos(endpoint);
}

async function obtenerReportePorId(id) {
    return await getDatosPorId(endpoint, id);
}

async function crearReporte(data) {
    if (!data.tipo || !data.descripcion || !data.ubicacion) {
        throw new Error("Tipo, descripción y ubicación son obligatorios");
    }
    const hoy = new Date();
    const fechaActual = hoy.getDate() + "/" + (hoy.getMonth() + 1) + "/" + hoy.getFullYear();
    const nuevoReporte = {
        tipo: data.tipo,
        descripcion: data.descripcion,
        ubicacion: data.ubicacion,
        estado: "pendiente",
        fecha: fechaActual
    };

    return await postDatos(endpoint, nuevoReporte);
}

async function actualizarReporte(id, data) {
    return await patchDatos(endpoint, id, data);
}

async function eliminarReporte(id) {
    return await deleteDatos(endpoint, id);
}

export { obtenerReportes, obtenerReportePorId, crearReporte, actualizarReporte, eliminarReporte };