import { enviarMensaje } from "../services/servicesContacto.js";
import { obtenerSesionActiva } from "../services/servicesUsuarios.js";

const btnEnviar = document.getElementById("btnEnviarMensaje");
const comentarioInput = document.getElementById("comentario");

btnEnviar.addEventListener("click", async () => {
    const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));

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

    const comentario = comentarioInput.value.trim();

    if (!comentario) {
        Swal.fire({
            icon: 'warning',
            title: 'Campo Vacío',
            text: 'Por favor, escribe un comentario antes de enviar.',
            confirmButtonColor: '#ff8c00'
        });
        return;
    }

    const data = {
        nombre: usuarioActivo.nombre,
        apellido: usuarioActivo.apellido,
        cedula: usuarioActivo.id, // En el login guardamos id como cedula
        correo: usuarioActivo.correo,
        comentario: comentario,
        fecha: new Date().toLocaleDateString(),
        usuarioId: usuarioActivo.id
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
