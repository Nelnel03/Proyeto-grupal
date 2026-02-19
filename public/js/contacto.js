import { enviarMensaje } from "../services/servicesContacto.js";
import { obtenerSesionActiva } from "../services/servicesUsuarios.js";

const btnEnviar = document.getElementById("btnEnviarMensaje");
const cedulaInput = document.getElementById("cedula");
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
      
        cedula: cedulaInput.value.trim(),
        comentario: comentarioInput.value.trim(),
        fecha: new Date().toLocaleDateString(),
        usuarioId: sesion.usuarioId
    };

    if (!data.cedula || !data.comentario) {
        Swal.fire({
            icon: 'warning',
            title: 'Campos Incompletos',
            text: 'Por favor, completa todos los espacios del formulario.',
            confirmButtonColor: '#ff8c00'
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
        cedulaInput.value = "";
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
