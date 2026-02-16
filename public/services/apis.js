const BASE_URL = "";

async function getDatos(endpoint) {
    const response = await fetch(`${BASE_URL}/${endpoint}`);
    if (!response.ok) {
        console.error(`Error al obtener los datos de ${endpoint}`);
        throw new Error(`Error al obtener los datos de ${endpoint}`);
    }
    return response.json();
}

async function getDatosPorId(endpoint, id) {
    const response = await fetch(`${BASE_URL}/${endpoint}/${id}`);
    if (!response.ok) {
        console.error(`Error al obtener el registro ${id} de ${endpoint}`);
        throw new Error(`Error al obtener el registro ${id} de ${endpoint}`);
    }
    return response.json();
}

async function postDatos(endpoint, data) {
    const response = await fetch(`${BASE_URL}/${endpoint}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        console.error(`Error al crear nuevo registro en ${endpoint}`);
        throw new Error(`Error al crear nuevo registro en ${endpoint}`);
    }
    return await response.json();
}

async function patchDatos(endpoint, id, data) {
    const response = await fetch(`${BASE_URL}/${endpoint}/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        console.error(`Error al actualizar el registro ${id} en ${endpoint}`);
        throw new Error(`Error al actualizar el registro ${id} en ${endpoint}`);
    }
    return await response.json();
}

async function deleteDatos(endpoint, id) {
    const response = await fetch(`${BASE_URL}/${endpoint}/${id}`, {
        method: "DELETE",
    });
    if (!response.ok) {
        console.error(`Error al eliminar el registro ${id} de ${endpoint}`);
        throw new Error(`Error al eliminar el registro ${id} de ${endpoint}`);
    }
    return true;
}

export { getDatos, getDatosPorId, postDatos, patchDatos, deleteDatos };