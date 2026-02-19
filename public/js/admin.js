
// Importar servicios
import { obtenerReportes, obtenerReportePorId, actualizarReporte } from "../services/servicesReportes.js";
import { obtenerProyectos, crearProyecto, actualizarProyecto, eliminarProyecto } from "../services/servicesProyectos.js";
import { obtenerServicios, crearServicio, actualizarServicio, eliminarServicio } from "../services/servicesServicios.js";
import { obtenerMensajes, actualizarMensaje } from "../services/servicesContacto.js";
import {
    obtenerUsuarios,
    promoverAdmin,
    obtenerUsuarioPorId,
    obtenerSesionActiva,
    actualizarUsuario as actualizarUsuarioService,
    eliminarUsuario as eliminarUsuarioService
} from "../services/servicesUsuarios.js";
import { obtenerAdmins } from "../services/servicesAdmin.js";
import { obtenerFuncionarios, crearFuncionario, eliminarFuncionario } from "../services/servicesFuncionarios.js";
import { obtenerPlanillas, crearPlanilla, actualizarPlanilla, eliminarPlanilla } from "../services/servicesPlanillas.js";
import { obtenerFinanciamientos, crearFinanciamiento, actualizarFinanciamiento, eliminarFinanciamientoLogico as eliminarFinanciamiento } from "../services/servicesFinanciamiento.js";
import { patchDatos } from "../services/apis.js";

// PROTECCIÓN DE RUTA - Verificar que sea admin
document.addEventListener("DOMContentLoaded", async () => {
    try {
        const sesion = await obtenerSesionActiva();
        // Solo bloquear si hay una sesion activa con rol diferente a admin
        if (sesion && sesion.rol && sesion.rol !== "admin") {
            console.warn("Acceso denegado: Se requiere rol de administrador.");
            window.location.href = "../pages/home.html";
        }
    } catch (e) {
        console.warn("No se pudo verificar la sesión:", e.message);
    }
});

// Referencias DOM - Navegación
const btnMenuReportes = document.getElementById("btnMenuReportes");
const btnMenuProyectos = document.getElementById("btnMenuProyectos");
const btnMenuServicios = document.getElementById("btnMenuServicios");
const btnMenuMensajes = document.getElementById("btnMenuMensajes");
const btnMenuUsuarios = document.getElementById("btnMenuUsuarios");
const btnMenuPlanillas = document.getElementById("btnMenuPlanillas");
const btnMenuFinanciamiento = document.getElementById("btnMenuFinanciamiento");

const seccionReportes = document.getElementById("seccionReportes");
const seccionProyectos = document.getElementById("seccionProyectos");
const seccionServicios = document.getElementById("seccionServicios");
const seccionMensajes = document.getElementById("seccionMensajes");
const seccionUsuarios = document.getElementById("seccionUsuarios");
const seccionPlanillas = document.getElementById("seccionPlanillas");
const seccionFinanciamiento = document.getElementById("seccionFinanciamiento");

const secciones = [seccionReportes, seccionProyectos, seccionServicios, seccionMensajes, seccionUsuarios, seccionPlanillas, seccionFinanciamiento];
const botonesMenu = [btnMenuReportes, btnMenuProyectos, btnMenuServicios, btnMenuMensajes, btnMenuUsuarios, btnMenuPlanillas, btnMenuFinanciamiento];

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

// Referencias DOM - Planillas
const tablaPlanillas = document.getElementById("tablaPlanillas");
const planUsuarioId = document.getElementById("planUsuarioId");
const planPuesto = document.getElementById("planPuesto");
const planDepto = document.getElementById("planDepto");
const planSalarioBase = document.getElementById("planSalarioBase");
const planHorasExtra = document.getElementById("planHorasExtra");
const planRebajos = document.getElementById("planRebajos");
const planImagen = document.getElementById("planImagen");
const planDescripcion = document.getElementById("planDescripcion");
const planNetoPreview = document.getElementById("planNetoPreview");
const btnCrearPlanilla = document.getElementById("btnCrearPlanilla");
const btnCancelarPlanilla = document.getElementById("btnCancelarPlanilla");
const tituloFormPlanilla = document.getElementById("tituloFormPlanilla");

// Referencias DOM - Financiamiento
const tablaFinanciamientos = document.getElementById("tablaFinanciamientos");
const finProyecto = document.getElementById("finProyecto");
const finMonto = document.getElementById("finMonto");
const finMontoAprobado = document.getElementById("finMontoAprobado");
const finEstado = document.getElementById("finEstado");
const finTipo = document.getElementById("finTipo");
const finDescripcion = document.getElementById("finDescripcion");
const finResponsable = document.getElementById("finResponsable");
const finFechaInicio = document.getElementById("finFechaInicio");
const btnPublicarProyecto = document.getElementById("btnPublicarProyecto");
const btnGuardarBorrador = document.getElementById("btnGuardarBorrador");
const btnEliminarSolicitud = document.getElementById("btnEliminarSolicitud");
const btnCancelarResolucion = document.getElementById("btnCancelarResolucion");
const formAprobacionFinanciamiento = document.getElementById("formAprobacionFinanciamiento");
const tituloFormFinanciamiento = document.getElementById("tituloFormFinanciamiento");

// Estado de edición
let proyectoEditandoId = null;
let servicioEditandoId = null;
let planillaEditandoId = null;
let financiamientoEditandoId = null;

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

btnMenuPlanillas.addEventListener("click", () => {
    mostrarSeccion(5);
    cargarSeccionPlanillas();
});

btnMenuFinanciamiento.addEventListener("click", () => {
    mostrarSeccion(6);
    cargarFinanciamientos();
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
            const rolActual = user.rol || "ciudadano";
            const fila = document.createElement("tr");

            fila.innerHTML = `
                <td>${user.id}</td>
                <td>${user.nombre} ${user.apellido}</td>
                <td>${user.correo}</td>
                <td><span class="badge rol-${rolActual}">${rolActual}</span></td>
                <td class="acciones">
                    ${esAdmin
                    ? '<span class="estado-badge estado-resuelto">Administrador Sistema</span>'
                    : `
                        <button class="btn btn-editar btn-editar-user" data-id="${user.id}" title="Editar Usuario"><i class="ri-edit-line"></i></button>
                        <button class="btn btn-eliminar btn-eliminar-user" data-id="${user.id}" title="Eliminar Usuario"><i class="ri-delete-bin-line"></i></button>
                      `
                }
                </td>
            `;
            tablaUsuarios.appendChild(fila);
        });

        document.querySelectorAll(".btn-editar-user").forEach(btn => {
            btn.onclick = () => editarUsuarioHandler(btn.dataset.id);
        });

        document.querySelectorAll(".btn-eliminar-user").forEach(btn => {
            btn.onclick = () => eliminarUsuarioHandler(btn.dataset.id);
        });

    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al cargar usuarios: ' + error.message
        });
    }
}

async function editarUsuarioHandler(id) {
    try {
        const user = await obtenerUsuarioPorId(id);
        if (!user) return;

        const { value: formValues } = await Swal.fire({
            title: 'Editar Usuario',
            html: `
                <div class="swal-form" style="text-align: left;">
                    <label>Nombre:</label>
                    <input id="swal-input-nombre" class="swal2-input" value="${user.nombre}">
                    <label>Apellido:</label>
                    <input id="swal-input-apellido" class="swal2-input" value="${user.apellido || ''}">
                    <label>Correo:</label>
                    <input id="swal-input-correo" class="swal2-input" value="${user.correo}">
                    <label>Rol:</label>
                    <select id="swal-input-rol" class="swal2-input">
                        <option value="ciudadano" ${user.rol === 'ciudadano' ? 'selected' : ''}>Ciudadano</option>
                        <option value="funcionario" ${user.rol === 'funcionario' ? 'selected' : ''}>Funcionario</option>
                        <option value="admin" ${user.rol === 'admin' ? 'selected' : ''}>Administrador</option>
                    </select>
                </div>
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Guardar Cambios',
            cancelButtonText: 'Cancelar',
            preConfirm: () => {
                return {
                    nombre: document.getElementById('swal-input-nombre').value,
                    apellido: document.getElementById('swal-input-apellido').value,
                    correo: document.getElementById('swal-input-correo').value,
                    rol: document.getElementById('swal-input-rol').value
                }
            }
        });

        if (formValues) {
            // Si el rol cambia a admin, usar el servicio de promoción
            if (formValues.rol === 'admin' && user.rol !== 'admin') {
                await promoverAdmin(user);
            } else if (formValues.rol === 'funcionario' && user.rol !== 'funcionario') {
                // Crear perfil de funcionario si cambia a ese rol
                await crearFuncionario({
                    id: `fun-${user.id}`,
                    nombre: formValues.nombre,
                    apellido: formValues.apellido,
                    correo: formValues.correo,
                    password: user.password,
                    telefono: user.telefono || ""
                });
                await actualizarUsuarioService(id, formValues);
            } else {
                await actualizarUsuarioService(id, formValues);
            }

            Swal.fire('¡Actualizado!', 'El usuario ha sido modificado con éxito.', 'success');
            cargarUsuarios();
        }
    } catch (error) {
        Swal.fire('Error', 'No se pudo editar el usuario: ' + error.message, 'error');
    }
}

async function eliminarUsuarioHandler(id) {
    const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: "Esta acción eliminará al usuario permanentemente.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
        try {
            await eliminarUsuarioService(id);
            Swal.fire('Eliminado', 'El usuario ha sido eliminado.', 'success');
            cargarUsuarios();
        } catch (error) {
            Swal.fire('Error', 'No se pudo eliminar: ' + error.message, 'error');
        }
    }
}

// MÓDULO PLANILLAS

async function cargarSeccionPlanillas() {
    await cargarUsuariosEnSelect();
    await cargarPlanillas();
}

async function cargarUsuariosEnSelect() {
    try {
        const usuarios = await obtenerUsuarios();
        planUsuarioId.innerHTML = '<option value="">-- Seleccionar Empleado --</option>';
        usuarios.forEach(u => {
            const opt = document.createElement("option");
            opt.value = u.id;
            opt.dataset.nombre = `${u.nombre} ${u.apellido}`;
            opt.textContent = `${u.nombre} ${u.apellido} (${u.correo})`;
            planUsuarioId.appendChild(opt);
        });
    } catch (error) {
        console.error("Error al cargar usuarios para select:", error);
    }
}

async function cargarPlanillas() {
    try {
        const planillas = await obtenerPlanillas();
        tablaPlanillas.innerHTML = "";

        if (planillas.length === 0) {
            tablaPlanillas.innerHTML = `<tr><td colspan="7" style="text-align:center;">No hay registros salariales</td></tr>`;
            return;
        }

        planillas.forEach((p) => {
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${p.empleado}</td>
                <td>${p.puesto} <br><small>${p.departamento}</small></td>
                <td>₡${Number(p.salarioBase).toLocaleString()}</td>
                <td>${p.horasExtra}</td>
                <td>₡${Number(p.rebajos).toLocaleString()}</td>
                <td><strong style="color: #27ae60;">₡${Number(p.salarioNeto).toLocaleString('es-CR', { minimumFractionDigits: 2 })}</strong></td>
                <td class="acciones">
                    <button class="btn btn-editar btn-editar-planilla" data-id="${p.id}">Editar</button>
                    <button class="btn btn-eliminar btn-eliminar-planilla" data-id="${p.id}">Eliminar</button>
                </td>
            `;
            tablaPlanillas.appendChild(fila);
        });

        document.querySelectorAll(".btn-editar-planilla").forEach(btn => {
            btn.onclick = () => editarPlanillaHandler(btn.dataset.id);
        });
        document.querySelectorAll(".btn-eliminar-planilla").forEach(btn => {
            btn.onclick = () => eliminarPlanillaHandler(btn.dataset.id);
        });

    } catch (error) {
        console.error("Error al cargar planillas:", error);
    }
}

function calcularSalarioNetoLocal() {
    const base = parseFloat(planSalarioBase.value) || 0;
    const extras = parseFloat(planHorasExtra.value) || 0;
    const rebajos = parseFloat(planRebajos.value) || 0;

    const valorHora = base / 160;
    const neto = (base + (extras * valorHora * 1.5)) - rebajos;
    planNetoPreview.textContent = Math.max(0, neto).toLocaleString('es-CR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

[planSalarioBase, planHorasExtra, planRebajos].forEach(input => {
    input.addEventListener("input", calcularSalarioNetoLocal);
});

btnCrearPlanilla.addEventListener("click", async () => {
    const usuarioId = planUsuarioId.value;
    const empleado = planUsuarioId.options[planUsuarioId.selectedIndex]?.dataset.nombre;

    if (!usuarioId || !planPuesto.value || !planSalarioBase.value) {
        Swal.fire('Error', 'Empleado, puesto y salario base son obligatorios.', 'warning');
        return;
    }

    const base = parseFloat(planSalarioBase.value);
    const extras = parseFloat(planHorasExtra.value) || 0;
    const rebajos = parseFloat(planRebajos.value) || 0;
    const valorHora = base / 160;
    const neto = (base + (extras * valorHora * 1.5)) - rebajos;

    const data = {
        usuarioId: usuarioId,
        empleado: empleado,
        puesto: planPuesto.value,
        departamento: planDepto.value,
        salarioBase: base,
        horasExtra: extras,
        rebajos: rebajos,
        salarioNeto: Math.max(0, neto),
        imagen: planImagen.value,
        descripcion: planDescripcion.value
    };

    try {
        if (planillaEditandoId) {
            await actualizarPlanilla(planillaEditandoId, data);
            Swal.fire('Actualizado', 'Registro salarial actualizado.', 'success');
        } else {
            await crearPlanilla(data);
            Swal.fire('Guardado', 'Registro salarial creado con éxito.', 'success');
        }
        limpiarFormularioPlanilla();
        cargarPlanillas();
    } catch (error) {
        Swal.fire('Error', 'No se pudo guardar la planilla.', 'error');
    }
});

function limpiarFormularioPlanilla() {
    planUsuarioId.value = "";
    planPuesto.value = "";
    planDepto.value = "";
    planSalarioBase.value = "";
    planHorasExtra.value = "0";
    planRebajos.value = "0";
    planImagen.value = "";
    planDescripcion.value = "";
    planillaEditandoId = null;
    tituloFormPlanilla.textContent = "Registrar Nueva Planilla";
    btnCrearPlanilla.textContent = "Guardar Planilla";
    btnCancelarPlanilla.style.display = "none";
    calcularSalarioNetoLocal();
}

async function editarPlanillaHandler(id) {
    try {
        const planillas = await obtenerPlanillas();
        const p = planillas.find(item => String(item.id) === String(id));
        if (!p) return;

        planUsuarioId.value = p.usuarioId;
        planPuesto.value = p.puesto;
        planDepto.value = p.departamento;
        planSalarioBase.value = p.salarioBase;
        planHorasExtra.value = p.horasExtra;
        planRebajos.value = p.rebajos;
        planImagen.value = p.imagen || "";
        planDescripcion.value = p.descripcion || "";

        planillaEditandoId = id;
        tituloFormPlanilla.textContent = "Editando Planilla de: " + p.empleado;
        btnCrearPlanilla.textContent = "Actualizar Planilla";
        btnCancelarPlanilla.style.display = "inline-block";
        calcularSalarioNetoLocal();
    } catch (error) {
        console.error("Error al cargar para editar:", error);
    }
}

async function eliminarPlanillaHandler(id) {
    const result = await Swal.fire({
        title: '¿Eliminar registro?',
        text: "Se borrará el historial salarial asignado.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar'
    });

    if (result.isConfirmed) {
        try {
            await eliminarPlanilla(id);
            Swal.fire('Eliminado', 'El registro ha sido eliminado.', 'success');
            cargarPlanillas();
        } catch (error) {
            Swal.fire('Error', 'No se pudo eliminar el registro.', 'error');
        }
    }
}

btnCancelarPlanilla.addEventListener("click", limpiarFormularioPlanilla);

// MÓDULO FINANCIAMIENTO (Aprobaciones)

async function cargarFinanciamientos() {
    try {
        const financiamientos = await obtenerFinanciamientos();
        tablaFinanciamientos.innerHTML = "";

        if (financiamientos.length === 0) {
            tablaFinanciamientos.innerHTML = `<tr><td colspan="6" style="text-align:center;">No hay solicitudes activas</td></tr>`;
            return;
        }

        financiamientos.forEach((f) => {
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td><strong>${f.nombre}</strong><br><small>${f.tipo === 'vial' ? '🚙 Vial' : '🏢 Servicio'}</small></td>
                <td>₡${Number(f.monto_solicitado).toLocaleString()}</td>
                <td>₡${Number(f.monto_aprobado || 0).toLocaleString()}</td>
                <td>${f.responsable || f.entidad_financiera || 'TBD'}</td>
                <td><span class="estado-badge ${getClaseEstadoFin(f.estado)}">${f.estado}</span></td>
                <td class="acciones">
                    <button class="btn btn-editar btn-editar-fin" data-id="${f.id}" title="Editar/Procesar"><i class="ri-edit-line"></i></button>
                    <button class="btn btn-eliminar btn-eliminar-fin" data-id="${f.id}" title="Eliminar"><i class="ri-delete-bin-line"></i></button>
                </td>
            `;
            tablaFinanciamientos.appendChild(fila);
        });

        document.querySelectorAll(".btn-editar-fin").forEach(btn => {
            btn.onclick = () => editarFinanciamientoHandler(btn.dataset.id);
        });

        document.querySelectorAll(".btn-eliminar-fin").forEach(btn => {
            btn.onclick = () => {
                const id = btn.dataset.id;
                confirmarEliminarFinanciamiento(id);
            };
        });

    } catch (error) {
        console.error("Error al cargar financiamientos para admin:", error);
    }
}

function getClaseEstadoFin(estado) {
    switch (estado) {
        case 'Aprobado': return 'estado-resuelto';
        case 'Rechazado': return 'estado-inactivo';
        default: return 'estado-pendiente';
    }
}

// Manejo de botones de resolución
async function procesarResolucionFinanciamiento(esPublicacion) {
    if (financiamientoEditandoId === null) return;

    const montoAprobado = Number(finMontoAprobado.value) || 0;
    const montoSolicitado = Number(finMonto.value);
    const nuevoEstado = esPublicacion ? "Aprobado" : finEstado.value;
    const nuevoNombre = finProyecto.value;
    const nuevaDesc = finDescripcion.value;
    const nuevoTipo = finTipo.value;
    const responsableFinal = finResponsable.value || "Asignado por Admin";
    const fechaInicioFinal = finFechaInicio.value || new Date().toISOString().split('T')[0];

    if (esPublicacion && nuevoTipo === "vial" && montoAprobado > montoSolicitado) {
        Swal.fire('Error de Validación', 'El monto aprobado no puede ser mayor al monto solicitado para publicar.', 'error');
        return;
    }

    const data = {
        nombre: nuevoNombre,
        descripcion: nuevaDesc,
        tipo: nuevoTipo,
        monto_aprobado: montoAprobado,
        estado: nuevoEstado,
        descripcion_admin: finDescripcion.value,
        responsable: responsableFinal,
        fecha_inicio: fechaInicioFinal,
        fecha_resolucion: new Date().toISOString().split('T')[0]
    };

    try {
        await actualizarFinanciamiento(financiamientoEditandoId, data);

        if (esPublicacion) {
            if (nuevoTipo === "vial") {
                await crearProyecto({
                    nombre: nuevoNombre,
                    presupuesto: montoAprobado,
                    fechaInicio: fechaInicioFinal,
                    descripcion: nuevaDesc,
                    estado: "Planificación"
                });
            } else if (nuevoTipo === "servicio") {
                await crearServicio({
                    tipo: nuevoNombre,
                    descripcion: nuevaDesc,
                    responsable: responsableFinal,
                    fechaInicio: fechaInicioFinal,
                    estado: "Activo"
                });
            }
            Swal.fire('¡Publicado!', 'El proyecto ha sido publicado en el Inicio.', 'success');
        } else {
            Swal.fire('Guardado', 'Los cambios se guardaron como borrador.', 'success');
        }

        limpiarFormularioFinanciamiento();
        cargarFinanciamientos();
    } catch (error) {
        Swal.fire('Error', 'No se pudo procesar la solicitud: ' + error.message, 'error');
    }
}

btnPublicarProyecto.addEventListener("click", () => procesarResolucionFinanciamiento(true));
btnGuardarBorrador.addEventListener("click", () => procesarResolucionFinanciamiento(false));

btnEliminarSolicitud.addEventListener("click", () => {
    confirmarEliminarFinanciamiento(financiamientoEditandoId);
});

async function confirmarEliminarFinanciamiento(id) {
    const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: "¡No podrás revertir esto!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
        try {
            await eliminarFinanciamiento(id);
            Swal.fire('Eliminado', 'La solicitud ha sido eliminada.', 'success');
            limpiarFormularioFinanciamiento();
            cargarFinanciamientos();
        } catch (error) {
            Swal.fire('Error', 'No se pudo eliminar: ' + error.message, 'error');
        }
    }
}

function limpiarFormularioFinanciamiento() {
    if (finProyecto) finProyecto.value = "";
    if (finMonto) finMonto.value = "";
    if (finMontoAprobado) finMontoAprobado.value = "";
    if (finDescripcion) finDescripcion.value = "";
    if (finResponsable) finResponsable.value = "";
    if (finFechaInicio) finFechaInicio.value = "";
    document.getElementById("containerFechaInicio").style.display = "none"; // Hide by default
    financiamientoEditandoId = null;
    formAprobacionFinanciamiento.style.display = "none";
}

async function editarFinanciamientoHandler(id) {
    try {
        const financiamientos = await obtenerFinanciamientos();
        const f = financiamientos.find(item => String(item.id) === String(id));
        if (!f) return;

        finProyecto.value = f.nombre || f.nombre_proyecto || "";
        finMonto.value = f.monto_solicitado || 0;
        finMontoAprobado.value = f.monto_aprobado || 0;
        finEstado.value = f.estado || "Pendiente";
        finTipo.value = f.tipo || "vial";
        finDescripcion.value = f.descripcion || "";
        finResponsable.value = f.responsable || f.entidad_financiera || "";
        finFechaInicio.value = f.fecha_inicio || new Date().toISOString().split('T')[0];

        // Mostrar/ocultar fecha de inicio según tipo
        document.getElementById("containerFechaInicio").style.display = finTipo.value === 'vial' ? 'block' : 'none';
        finTipo.onchange = () => {
            document.getElementById("containerFechaInicio").style.display = finTipo.value === 'vial' ? 'block' : 'none';
        };

        financiamientoEditandoId = id;
        formAprobacionFinanciamiento.style.display = "block";
        formAprobacionFinanciamiento.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        console.error("Error al cargar para resolución:", error);
    }
}

btnCancelarResolucion.addEventListener("click", limpiarFormularioFinanciamiento);

// Inicialización
cargarReportes();
