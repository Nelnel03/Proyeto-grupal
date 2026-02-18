

// Importar servicios
import { obtenerReportes, obtenerReportePorId, actualizarReporte } from "../services/servicesReportes.js";
import { obtenerProyectos, crearProyecto, actualizarProyecto, eliminarProyecto } from "../services/servicesProyectos.js";
import { obtenerServicios, crearServicio, actualizarServicio, eliminarServicio } from "../services/servicesServicios.js";
import { obtenerMensajes, actualizarMensaje } from "../services/servicesContacto.js";
import { obtenerUsuarios, promoverAdmin } from "../services/servicesUsuarios.js";
import { obtenerAdmins } from "../services/servicesAdmin.js";

// Referencias DOM - Navegación
const btnMenuReportes = document.getElementById("btnMenuReportes");
const btnMenuProyectos = document.getElementById("btnMenuProyectos");
const btnMenuServicios = document.getElementById("btnMenuServicios");
const btnMenuMensajes = document.getElementById("btnMenuMensajes");
const btnMenuUsuarios = document.getElementById("btnMenuUsuarios");

const seccionReportes = document.getElementById("seccionReportes");
const seccionProyectos = document.getElementById("seccionProyectos");
const seccionServicios = document.getElementById("seccionServicios");
const seccionMensajes = document.getElementById("seccionMensajes");
const seccionUsuarios = document.getElementById("seccionUsuarios");

const secciones = [seccionReportes, seccionProyectos, seccionServicios, seccionMensajes, seccionUsuarios];
const botonesMenu = [btnMenuReportes, btnMenuProyectos, btnMenuServicios, btnMenuMensajes, btnMenuUsuarios];

// Referencias DOM - Reportes
const tablaReportes = document.getElementById("tablaReportes");
const modalDetalle = document.getElementById("modalDetalle");
const btnCerrarModal = document.getElementById("btnCerrarModal");
const detalleId = document.getElementById("detalleId");
const detalleUsuario = document.getElementById("detalleUsuario");
const detalleTipo = document.getElementById("detalleTipo");
const detalleDescripcion = document.getElementById("detalleDescripcion");
const detalleUbicacion = document.getElementById("detalleUbicacion");
const detalleEstado = document.getElementById("detalleEstado");
const detalleFecha = document.getElementById("detalleFecha");

// Referencias DOM - Proyectos
const tablaProyectos = document.getElementById("tablaProyectos");
const proyNombre = document.getElementById("proyNombre");
const proyDescripcion = document.getElementById("proyDescripcion");
const proyPresupuesto = document.getElementById("proyPresupuesto");
const proyFechaInicio = document.getElementById("proyFechaInicio");
const proyEstado = document.getElementById("proyEstado");
const btnCrearProyecto = document.getElementById("btnCrearProyecto");
const btnCancelarProyecto = document.getElementById("btnCancelarProyecto");
const tituloFormProyecto = document.getElementById("tituloFormProyecto");

// Referencias DOM - Servicios
const tablaServicios = document.getElementById("tablaServicios");
const servTipo = document.getElementById("servTipo");
const servDescripcion = document.getElementById("servDescripcion");
const servResponsable = document.getElementById("servResponsable");
const servEstado = document.getElementById("servEstado");
const btnCrearServicio = document.getElementById("btnCrearServicio");
const btnCancelarServicio = document.getElementById("btnCancelarServicio");
const tituloFormServicio = document.getElementById("tituloFormServicio");

// Referencias DOM - Mensajes
const tablaMensajes = document.getElementById("tablaMensajes");

// Referencias DOM - Usuarios
const tablaUsuarios = document.getElementById("tablaUsuarios");

// Estado de edición
let proyectoEditandoId = null;
let servicioEditandoId = null;

// Lógica de Navegación
function mostrarSeccion(indice) {
    secciones.forEach((sec) => sec.classList.remove("activa"));
    botonesMenu.forEach((btn) => btn.classList.remove("active"));

    secciones[indice].classList.add("activa");
    botonesMenu[indice].classList.add("active");
}

btnMenuReportes.addEventListener("click", () => {
    mostrarSeccion(0);
    cargarReportes();
});

btnMenuProyectos.addEventListener("click", () => {
    mostrarSeccion(1);
    cargarProyectos();
});

btnMenuServicios.addEventListener("click", () => {
    mostrarSeccion(2);
    cargarServicios();
});

btnMenuMensajes.addEventListener("click", () => {
    mostrarSeccion(3);
    cargarMensajes();
});

btnMenuUsuarios.addEventListener("click", () => {
    mostrarSeccion(4);
    cargarUsuarios();
});

// MÓDULO REPORTES

async function cargarReportes() {
    try {
        const reportes = await obtenerReportes();
        tablaReportes.innerHTML = "";

        if (reportes.length === 0) {
            tablaReportes.innerHTML = `<tr><td colspan="7" style="text-align:center;">No hay reportes registrados</td></tr>`;
            return;
        }

        reportes.forEach((reporte) => {
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${reporte.id}</td>
                <td>${reporte.tipo}</td>
                <td>${reporte.descripcion}</td>
                <td>${reporte.ubicacion}</td>
                <td>
                    <select class="estado-select" data-id="${reporte.id}">
                        <option value="Pendiente" ${reporte.estado === "Pendiente" || reporte.estado === "pendiente" ? "selected" : ""}>Pendiente</option>
                        <option value="En Proceso" ${reporte.estado === "En Proceso" ? "selected" : ""}>En Proceso</option>
                        <option value="Resuelto" ${reporte.estado === "Resuelto" ? "selected" : ""}>Resuelto</option>
                    </select>
                </td>
                <td>${reporte.fecha}</td>
                <td class="acciones">
                    <button class="btn btn-detalle btn-ver-detalle" data-id="${reporte.id}">Ver Detalle</button>
                    <button class="btn btn-actualizar btn-actualizar-estado" data-id="${reporte.id}">Actualizar</button>
                </td>
            `;
            tablaReportes.appendChild(fila);
        });

        const botonesDetalle = document.querySelectorAll(".btn-ver-detalle");
        botonesDetalle.forEach((btn) => {
            btn.addEventListener("click", () => {
                verDetalleReporte(btn.dataset.id);
            });
        });

        const botonesActualizar = document.querySelectorAll(".btn-actualizar-estado");
        botonesActualizar.forEach((btn) => {
            btn.addEventListener("click", () => {
                const id = btn.dataset.id;
                const select = document.querySelector(`select[data-id="${id}"]`);
                actualizarEstadoReporte(id, select.value);
            });
        });

    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al cargar reportes: ' + error.message
        });
    }
}

async function verDetalleReporte(id) {
    try {
        const reporte = await obtenerReportePorId(id);
        detalleId.textContent = reporte.id;
        detalleTipo.textContent = reporte.tipo;
        detalleDescripcion.textContent = reporte.descripcion;
        detalleUbicacion.textContent = reporte.ubicacion;
        detalleEstado.textContent = reporte.estado;
        detalleFecha.textContent = reporte.fecha;

        // Intentar obtener el nombre del usuario
        if (reporte.usuarioId) {
            try {
                const usuario = await obtenerUsuarioPorId(reporte.usuarioId);
                detalleUsuario.textContent = `${usuario.nombre} ${usuario.apellido}`;
            } catch (err) {
                detalleUsuario.textContent = "Usuario no encontrado";
            }
        } else {
            detalleUsuario.textContent = "Anónimo";
        }

        modalDetalle.classList.add("visible");
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al obtener detalle: ' + error.message
        });
    }
}

async function actualizarEstadoReporte(id, nuevoEstado) {
    try {
        await actualizarReporte(id, { estado: nuevoEstado });
        Swal.fire({
            icon: 'success',
            title: 'Actualizado',
            text: "Estado del reporte actualizado a: " + nuevoEstado,
            timer: 2000,
            showConfirmButton: false
        });
        cargarReportes();
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al actualizar estado: ' + error.message
        });
    }
}

btnCerrarModal.addEventListener("click", () => {
    modalDetalle.classList.remove("visible");
});

// MÓDULO PROYECTOS

async function cargarProyectos() {
    try {
        const proyectos = await obtenerProyectos();
        tablaProyectos.innerHTML = "";

        if (proyectos.length === 0) {
            tablaProyectos.innerHTML = `<tr><td colspan="7" style="text-align:center;">No hay proyectos registrados</td></tr>`;
            return;
        }

        proyectos.forEach((proyecto) => {
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${proyecto.id}</td>
                <td>${proyecto.nombre}</td>
                <td>${proyecto.descripcion || "—"}</td>
                <td>₡${Number(proyecto.presupuesto).toLocaleString()}</td>
                <td>${proyecto.fechaInicio}</td>
                <td>${proyecto.estado}</td>
                <td class="acciones">
                    <button class="btn btn-editar btn-editar-proyecto" data-id="${proyecto.id}">Editar</button>
                    <button class="btn btn-eliminar btn-eliminar-proyecto" data-id="${proyecto.id}">Eliminar</button>
                </td>
            `;
            tablaProyectos.appendChild(fila);
        });

        const botonesEditar = document.querySelectorAll(".btn-editar-proyecto");
        botonesEditar.forEach((btn) => {
            btn.addEventListener("click", () => {
                editarProyectoHandler(btn.dataset.id);
            });
        });

        const botonesEliminar = document.querySelectorAll(".btn-eliminar-proyecto");
        botonesEliminar.forEach((btn) => {
            btn.addEventListener("click", () => {
                eliminarProyectoHandler(btn.dataset.id);
            });
        });

    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al cargar proyectos: ' + error.message
        });
    }
}

function limpiarFormularioProyecto() {
    proyNombre.value = "";
    proyDescripcion.value = "";
    proyPresupuesto.value = "";
    proyFechaInicio.value = "";
    proyEstado.value = "Planificación";
    proyectoEditandoId = null;
    tituloFormProyecto.textContent = "Crear Proyecto";
    btnCrearProyecto.textContent = "Guardar Proyecto";
    btnCancelarProyecto.style.display = "none";
}

btnCrearProyecto.addEventListener("click", async () => {
    if (!proyNombre.value || !proyPresupuesto.value || !proyFechaInicio.value) {
        Swal.fire({
            icon: 'warning',
            title: 'Campos requeridos',
            text: "Nombre, presupuesto y fecha de inicio son obligatorios."
        });
        return;
    }

    const data = {
        nombre: proyNombre.value,
        descripcion: proyDescripcion.value,
        presupuesto: proyPresupuesto.value,
        fechaInicio: proyFechaInicio.value,
        estado: proyEstado.value
    };

    try {
        if (proyectoEditandoId) {
            await actualizarProyecto(proyectoEditandoId, data);
            Swal.fire({
                icon: 'success',
                title: 'Éxito',
                text: "Proyecto actualizado correctamente",
                timer: 2000,
                showConfirmButton: false
            });
        } else {
            await crearProyecto(data);
            Swal.fire({
                icon: 'success',
                title: 'Éxito',
                text: "Proyecto creado correctamente",
                timer: 2000,
                showConfirmButton: false
            });
        }
        limpiarFormularioProyecto();
        cargarProyectos();
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.message
        });
    }
});

async function editarProyectoHandler(id) {
    try {
        const proyectos = await obtenerProyectos();
        const proyecto = proyectos.find((p) => String(p.id) === String(id));

        if (!proyecto) {
            Swal.fire({
                icon: 'error',
                title: 'No encontrado',
                text: "Proyecto no encontrado"
            });
            return;
        }

        proyNombre.value = proyecto.nombre;
        proyDescripcion.value = proyecto.descripcion || "";
        proyPresupuesto.value = proyecto.presupuesto;
        proyFechaInicio.value = proyecto.fechaInicio;
        proyEstado.value = proyecto.estado;

        proyectoEditandoId = id;
        tituloFormProyecto.textContent = "Editar Proyecto";
        btnCrearProyecto.textContent = "Actualizar Proyecto";
        btnCancelarProyecto.style.display = "inline-block";
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al cargar proyecto: ' + error.message
        });
    }
}

async function eliminarProyectoHandler(id) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "¿Estás seguro de que deseas eliminar este proyecto?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                await eliminarProyecto(id);
                Swal.fire({
                    icon: 'success',
                    title: 'Eliminado',
                    text: 'Proyecto eliminado correctamente',
                    timer: 2000,
                    showConfirmButton: false
                });
                cargarProyectos();
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error al eliminar: ' + error.message
                });
            }
        }
    });
}

btnCancelarProyecto.addEventListener("click", () => {
    limpiarFormularioProyecto();
});

// MÓDULO SERVICIOS

async function cargarServicios() {
    try {
        const servicios = await obtenerServicios();
        tablaServicios.innerHTML = "";

        if (servicios.length === 0) {
            tablaServicios.innerHTML = `<tr><td colspan="6" style="text-align:center;">No hay servicios registrados</td></tr>`;
            return;
        }

        servicios.forEach((servicio) => {
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${servicio.id}</td>
                <td>${servicio.tipo}</td>
                <td>${servicio.descripcion || "—"}</td>
                <td>${servicio.responsable}</td>
                <td>${servicio.estado}</td>
                <td class="acciones">
                    <button class="btn btn-editar btn-editar-servicio" data-id="${servicio.id}">Editar</button>
                    <button class="btn btn-eliminar btn-eliminar-servicio" data-id="${servicio.id}">Eliminar</button>
                </td>
            `;
            tablaServicios.appendChild(fila);
        });

        const botonesEditar = document.querySelectorAll(".btn-editar-servicio");
        botonesEditar.forEach((btn) => {
            btn.addEventListener("click", () => {
                editarServicioHandler(btn.dataset.id);
            });
        });

        const botonesEliminar = document.querySelectorAll(".btn-eliminar-servicio");
        botonesEliminar.forEach((btn) => {
            btn.addEventListener("click", () => {
                eliminarServicioHandler(btn.dataset.id);
            });
        });

    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al cargar servicios: ' + error.message
        });
    }
}

function limpiarFormularioServicio() {
    servTipo.value = "";
    servDescripcion.value = "";
    servResponsable.value = "";
    servEstado.value = "Activo";
    servicioEditandoId = null;
    tituloFormServicio.textContent = "Crear Servicio";
    btnCrearServicio.textContent = "Guardar Servicio";
    btnCancelarServicio.style.display = "none";
}

btnCrearServicio.addEventListener("click", async () => {
    if (!servTipo.value || !servDescripcion.value || !servResponsable.value) {
        Swal.fire({
            icon: 'warning',
            title: 'Campos requeridos',
            text: "Tipo, descripción y responsable son obligatorios."
        });
        return;
    }

    const data = {
        tipo: servTipo.value,
        descripcion: servDescripcion.value,
        responsable: servResponsable.value,
        estado: servEstado.value
    };

    try {
        if (servicioEditandoId) {
            await actualizarServicio(servicioEditandoId, data);
            Swal.fire({
                icon: 'success',
                title: 'Éxito',
                text: "Servicio actualizado correctamente",
                timer: 2000,
                showConfirmButton: false
            });
        } else {
            await crearServicio(data);
            Swal.fire({
                icon: 'success',
                title: 'Éxito',
                text: "Servicio creado correctamente",
                timer: 2000,
                showConfirmButton: false
            });
        }
        limpiarFormularioServicio();
        cargarServicios();
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.message
        });
    }
});

async function editarServicioHandler(id) {
    try {
        const servicios = await obtenerServicios();
        const servicio = servicios.find((s) => String(s.id) === String(id));

        if (!servicio) {
            Swal.fire({
                icon: 'error',
                title: 'No encontrado',
                text: "Servicio no encontrado"
            });
            return;
        }

        servTipo.value = servicio.tipo;
        servDescripcion.value = servicio.descripcion || "";
        servResponsable.value = servicio.responsable;
        servEstado.value = servicio.estado;

        servicioEditandoId = id;
        tituloFormServicio.textContent = "Editar Servicio";
        btnCrearServicio.textContent = "Actualizar Servicio";
        btnCancelarServicio.style.display = "inline-block";
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al cargar servicio: ' + error.message
        });
    }
}

async function eliminarServicioHandler(id) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "¿Estás seguro de que deseas eliminar este servicio?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                await eliminarServicio(id);
                Swal.fire({
                    icon: 'success',
                    title: 'Eliminado',
                    text: 'Servicio eliminado correctamente',
                    timer: 2000,
                    showConfirmButton: false
                });
                cargarServicios();
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error al eliminar: ' + error.message
                });
            }
        }
    });
}

btnCancelarServicio.addEventListener("click", () => {
    limpiarFormularioServicio();
});

// MÓDULO MENSAJES

async function cargarMensajes() {
    try {
        const mensajes = await obtenerMensajes();
        tablaMensajes.innerHTML = "";

        if (mensajes.length === 0) {
            tablaMensajes.innerHTML = `<tr><td colspan="5" style="text-align:center;">No hay mensajes recibidos</td></tr>`;
            return;
        }

        mensajes.forEach((msg) => {
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${msg.fecha || "-"}</td>
                <td>${msg.nombre} ${msg.apellido}</td>
                <td>${msg.cedula}</td>
                <td>${msg.correo}</td>
                <td>
                    <div class="mensaje-texto">${msg.comentario}</div>
                    ${msg.respuesta ? `<div class="respuesta-admin"><strong>Respuesta:</strong> ${msg.respuesta}</div>` : ""}
                </td>
                <td class="acciones">
                    <button class="btn btn-actualizar btn-responder-mensaje" data-id="${msg.id}">
                        ${msg.respuesta ? "Editar Respuesta" : "Responder"}
                    </button>
                </td>
            `;
            tablaMensajes.appendChild(fila);
        });

        const botonesResponder = document.querySelectorAll(".btn-responder-mensaje");
        botonesResponder.forEach((btn) => {
            btn.addEventListener("click", () => {
                responderMensaje(btn.dataset.id);
            });
        });

    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al cargar mensajes: ' + error.message
        });
    }
}

async function responderMensaje(id) {
    try {
        const mensajes = await obtenerMensajes();
        const mensaje = mensajes.find(m => String(m.id) === String(id));

        const { value: respuesta } = await Swal.fire({
            title: 'Responder Mensaje',
            input: 'textarea',
            inputLabel: `Responder a ${mensaje.nombre}`,
            inputValue: mensaje.respuesta || "",
            inputPlaceholder: 'Escribe tu respuesta aquí...',
            showCancelButton: true,
            confirmButtonColor: '#ff8c00',
            confirmButtonText: 'Enviar Respuesta',
            cancelButtonText: 'Cancelar'
        });

        if (respuesta) {
            await actualizarMensaje(id, { respuesta: respuesta });
            Swal.fire({
                icon: 'success',
                title: 'Respuesta Enviada',
                text: 'El ciudadano podrá ver esta respuesta en su perfil.',
                timer: 2000,
                showConfirmButton: false
            });
            cargarMensajes();
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al responder: ' + error.message
        });
    }
}

// MÓDULO USUARIOS

async function cargarUsuarios() {
    try {
        const usuarios = await obtenerUsuarios();
        const admins = await obtenerAdmins();
        tablaUsuarios.innerHTML = "";

        if (usuarios.length === 0) {
            tablaUsuarios.innerHTML = `<tr><td colspan="5" style="text-align:center;">No hay usuarios registrados</td></tr>`;
            return;
        }

        usuarios.forEach((user) => {
            const esAdmin = admins.some(a => a.correo === user.correo);
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${user.id}</td>
                <td>${user.nombre} ${user.apellido}</td>
                <td>${user.correo}</td>
                <td>${user.telefono}</td>
                <td class="acciones">
                    ${esAdmin
                    ? '<span class="estado-badge estado-resuelto">Administrador</span>'
                    : `<button class="btn btn-actualizar btn-promover-user" data-id="${user.id}">Promover a Admin</button>`
                }
                </td>
            `;
            tablaUsuarios.appendChild(fila);
        });

        const botonesPromover = document.querySelectorAll(".btn-promover-user");
        botonesPromover.forEach((btn) => {
            btn.addEventListener("click", () => {
                promoverUsuario(btn.dataset.id);
            });
        });

    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al cargar usuarios: ' + error.message
        });
    }
}

async function promoverUsuario(id) {
    Swal.fire({
        title: '¿Promover a Administrador?',
        text: "¿Estás seguro de que deseas otorgar permisos de administrador a este usuario?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#ff8c00',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, promover',
        cancelButtonText: 'Cancelar'
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const usuarios = await obtenerUsuarios();
                const usuario = usuarios.find(u => String(u.id) === String(id));

                if (usuario) {
                    await promoverAdmin(usuario);
                    Swal.fire({
                        icon: 'success',
                        title: 'Éxito',
                        text: `${usuario.nombre} ahora es administrador.`,
                        timer: 2000,
                        showConfirmButton: false
                    });
                    cargarUsuarios();
                }
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.message
                });
            }
        }
    });
}

// Inicialización
cargarReportes();
