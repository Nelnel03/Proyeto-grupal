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

    if (!sesion || !sesion.usuarioId) {
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
        fecha: new Date().toLocaleDateString()
    };

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
