import { iniciarSesion } from "../services/servicesUsuarios.js";
import { iniciarSesionAdmin } from "../services/servicesAdmin.js";

const btnIniciarSesion = document.getElementById("bntLogin");
const emailInput = document.getElementById("correo");
const passwordInput = document.getElementById("contraseña");

btnIniciarSesion.addEventListener("click", async () => {
    if (!emailInput.value || !passwordInput.value) {
        Swal.fire({
            icon: 'warning',
            title: 'Campos incompletos',
            text: 'Por favor, completa todos los campos.'
        });
        return;
    }

    const email = emailInput.value;
    const password = passwordInput.value;

    try {
        const admin = await iniciarSesionAdmin(email, password);

        if (admin) {
            Swal.fire({
                icon: 'success',
                title: 'Bienvenido Administrador',
                text: admin.nombre,
                timer: 2000,
                showConfirmButton: false
            }).then(() => {
                window.location.href = "../pages/admin.html";
            });
            return;
        }

        const usuario = await iniciarSesion(email, password);
        Swal.fire({
            icon: 'success',
            title: 'Bienvenido',
            text: usuario.nombre,
            timer: 2000,
            showConfirmButton: false
        }).then(() => {
            window.location.href = "../pages/home.html";
        });

    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error de autenticación',
            text: 'Correo o contraseña incorrectos'
        });
    }
});