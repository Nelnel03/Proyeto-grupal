import { registrarUsuario } from "../services/servicesUsuarios.js";

const nombre = document.getElementById("nombre");
const apellido = document.getElementById("apellido");
const email = document.getElementById("email");
const password = document.getElementById("password");
const telefono = document.getElementById("telefono");
const btn = document.getElementById("btn");

btn.addEventListener("click", async () => {
    if (!nombre.value || !apellido.value || !email.value || !password.value || !telefono.value) {
        Swal.fire({
            icon: 'warning',
            title: 'Campos incompletos',
            text: 'Por favor, completa todos los campos.'
        });
        return;
    }

    if (!email.value.includes('@')) {
        Swal.fire({
            icon: 'error',
            title: 'Error de autenticación',
            text: 'El correo debe contener un "@"'
        });
        return;
    }

    if (telefono.value.length > 8 || Number(telefono.value) < 0) {
        Swal.fire({
            icon: 'error',
            title: 'Teléfono inválido',
            text: 'El teléfono debe tener máximo 8 dígitos y no puede ser negativo.'
        });
        return;
    }

    const data = {
        nombre: nombre.value,
        apellido: apellido.value,
        correo: email.value,
        password: password.value,
        telefono: telefono.value
    };

    try {
        await registrarUsuario(data);
        Swal.fire({
            icon: 'success',
            title: 'Registro exitoso',
            text: 'Usuario registrado con éxito',
            timer: 2000,
            showConfirmButton: false
        }).then(() => {
            window.location.href = "../pages/login.html";
        });
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error al registrar',
            text: error.message
        });
    }
});
