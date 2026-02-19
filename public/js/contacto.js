import { enviarMensaje } from "../services/servicesContacto.js";
import { obtenerSesionActiva } from "../services/servicesUsuarios.js";

const btnEnviar = document.getElementById("btnEnviarMensaje");
const nombreInput = document.getElementById("nombre");
const apellidoInput = document.getElementById("apellido");
const cedulaInput = document.getElementById("cedula");
const correoInput = document.getElementById("correo");
const comentarioInput = document.getElementById("comentario");

btnEnviar.addEventListener("click", async () => {
    const sesion = await obtenerSesionActiva();

    if (!usuarioActivo) {
        Swal.fire({
            icon: 'warning',
            title: 'Acceso Restringido',
            text: 'Debes iniciar sesión para enviar un mensaje.',
            confirmButtonText: 'Ir al Login',
            confirmButtonColor: '#ff8c00'
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = "../pages/login.html";
            }
        });
        return;
    }

    const data = {
        nombre: nombreInput.value.trim(),
        apellido: apellidoInput.value.trim(),
        cedula: cedulaInput.value.trim(),
        correo: correoInput.value.trim(),
        comentario: comentarioInput.value.trim(),
        fecha: new Date().toLocaleDateString(),
        usuarioId: sesion.usuarioId
    };

    if (!data.nombre || !data.apellido || !data.cedula || !data.correo || !data.comentario) {
        Swal.fire({
            icon: 'warning',
            title: 'Campo Vacío',
            text: 'Por favor, escribe un comentario antes de enviar.',
            confirmButtonColor: '#ff8c00'
        });
        return;
    }

    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegex.test(data.correo.toLowerCase())) {
        Swal.fire({
            icon: 'error',
            title: 'Correo Inválido',
            text: 'La dirección de correo electrónico no es válida.',
            confirmButtonColor: '#d33'
        });
        return;
    }

    try {
        await enviarMensaje(data);

        Swal.fire({
            icon: 'success',
            title: 'Mensaje Enviado',
            text: 'Gracias por contactarnos. Tu mensaje ha sido enviado al administrador.',
            confirmButtonColor: '#ff8c00'
        });

        // Limpiar formulario
        nombreInput.value = "";
        apellidoInput.value = "";
        cedulaInput.value = "";
        correoInput.value = "";
        comentarioInput.value = "";

        

    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.message,
            confirmButtonColor: '#d33'
        });

    }
});



cedulaInput.addEventListener("input", (e) => {
    e.target.value = e.target.value.replace(/\D/g, "").slice(0, 10);
});
