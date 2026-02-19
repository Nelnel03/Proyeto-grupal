import { getDatos, postDatos, patchDatos, deleteDatos } from "./apis.js";

const endpoint = "financiamientos";


const obtenerFinanciamientos = async () => {
    const todos = await getDatos(endpoint);
    return todos.filter(f => f.activo !== false);
};




const crearFinanciamiento = async (data) => {
    const nuevo = {
        ...data,
        monto_aprobado: 0,
        estado: "Pendiente",
        fecha_solicitud: new Date().toISOString().split('T')[0],
        fecha_resolucion: null,
        activo: true
        // El objeto data contendrá: tipo, nombre, descripcion, monto_solicitado, responsable, reporteId
    };
    return await postDatos(endpoint, nuevo);
};



const actualizarFinanciamiento = async (id, data) => {
    return await patchDatos(endpoint, id, data);
};





const eliminarFinanciamientoLogico = async (id) => {
    return await patchDatos(endpoint, id, { activo: false });
};





const eliminarFinanciamientoFisico = async (id) => {
    return await deleteDatos(endpoint, id);
};




export { obtenerFinanciamientos, crearFinanciamiento, actualizarFinanciamiento, eliminarFinanciamientoLogico, eliminarFinanciamientoFisico };