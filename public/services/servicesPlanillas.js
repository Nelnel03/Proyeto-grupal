import { getDatos, getDatosPorId, postDatos, patchDatos, deleteDatos } from "./apis.js";

const endpoint = "planillas";




async function obtenerPlanillas() {
    return await getDatos(endpoint);
}




async function obtenerPlanillaPorId(id) {
    return await getDatosPorId(endpoint, id);
}





async function crearPlanilla(data) {
    if (!data.empleado || !data.puesto || !data.departamento || data.salarioBase === undefined) {
        throw new Error("Datos incompletos para crear la planilla");
    }


    const nuevaPlanilla = {
        usuarioId: data.usuarioId,
        empleado: data.empleado,
        puesto: data.puesto,
        departamento: data.departamento,
        salarioBase: Number(data.salarioBase),
        horasExtra: Number(data.horasExtra || 0),
        rebajos: Number(data.rebajos || 0),
        salarioNeto: Number(data.salarioNeto),
        imagen: data.imagen || "",
        descripcion: data.descripcion || ""
    };

    return await postDatos(endpoint, nuevaPlanilla);
}






async function actualizarPlanilla(id, data) {
    return await patchDatos(endpoint, id, data);
}






async function eliminarPlanilla(id) {
    return await deleteDatos(endpoint, id);
}





export { obtenerPlanillas, obtenerPlanillaPorId, crearPlanilla, actualizarPlanilla, eliminarPlanilla };
