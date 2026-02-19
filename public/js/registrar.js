import { registrarUsuario } from "../services/servicesUsuarios.js";

const cedula = document.getElementById("cedula");
const nombre = document.getElementById("nombre");
const apellido = document.getElementById("apellido");
const email = document.getElementById("email");
const password = document.getElementById("password");
const telefono = document.getElementById("telefono");
const btn = document.getElementById("btn");

btn.addEventListener("click", async () => {
    if (!cedula.value || !nombre.value || !apellido.value || !email.value || !password.value || !telefono.value) {
        Swal.fire({
            icon: 'warning',
            title: 'Campos incompletos',
            text: 'Por favor, completa todos los campos.'
        });
        return;
    }

    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegex.test(email.value.toLowerCase())) {
        Swal.fire({
            icon: 'error',
            title: 'Correo inválido',
            text: 'Por favor, ingresa un correo electrónico real (ejemplo@dominio.com).'
        });
        return;
    }

    if (password.value.length < 8) {
        Swal.fire({
            icon: 'error',
            title: 'Contraseña débil',
            text: 'La contraseña debe tener al menos 8 caracteres para mayor seguridad.'
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
        id: cedula.value,
        cedula: cedula.value,
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
