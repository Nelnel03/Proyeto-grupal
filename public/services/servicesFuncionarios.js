import { getDatos, postDatos, deleteDatos, BASE_URL } from "./apis.js";

const endpoint = "funcionarios";
const endpointSesion = "sesionActiva";



async function obtenerFuncionarios() {
    return await getDatos(endpoint);
}





async function iniciarSesionFuncionario(correo, password) {
    const funcionarios = await obtenerFuncionarios();
    const emailNormalizado = correo.trim().toLowerCase();
    const passwordNormalizado = password.trim();

    const funcionarioEncontrado = funcionarios.find(f =>
        f.correo.trim().toLowerCase() === emailNormalizado &&
        f.password.trim() === passwordNormalizado
    );

    if (funcionarioEncontrado) {
        await fetch(`${BASE_URL}/${endpointSesion}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                usuarioId: funcionarioEncontrado.id,
                rol: "funcionario"
            })
        });

        // Guardar en localStorage
        localStorage.setItem("usuarioActivo", JSON.stringify({
            id: funcionarioEncontrado.id,
            nombre: funcionarioEncontrado.nombre,
            apellido: funcionarioEncontrado.apellido || "",
            cedula: funcionarioEncontrado.cedula || "N/A",
            correo: funcionarioEncontrado.correo,
            rol: "funcionario"
        }));

        return funcionarioEncontrado;
    }

    return null;
}





async function crearFuncionario(data) {
    return await postDatos(endpoint, { ...data, rol: "funcionario" });
}





async function eliminarFuncionario(id) {
    return await deleteDatos(endpoint, id);
}



export { obtenerFuncionarios, iniciarSesionFuncionario, crearFuncionario, eliminarFuncionario };
