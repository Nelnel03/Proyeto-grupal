import { iniciarSesion } from "../services/servicesUsuarios.js";
import { iniciarSesionAdmin } from "../services/servicesAdmin.js";
import { iniciarSesionFuncionario } from "../services/servicesFuncionarios.js";

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

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    try {
        // 1. Intentar como Administrador
        const admin = await iniciarSesionAdmin(email, password);
        if (admin) {
            Swal.fire({ icon: 'success', title: '¡Bienvenido Administrador!', text: admin.nombre, timer: 2000, showConfirmButton: false })
                .then(() => { window.location.href = "../pages/admin.html"; });
            return;
        }

        // 2. Intentar como Funcionario
        const funcionario = await iniciarSesionFuncionario(email, password);
        if (funcionario) {
            Swal.fire({ icon: 'success', title: '¡Bienvenido Funcionario!', text: funcionario.nombre, timer: 2000, showConfirmButton: false })
                .then(() => { window.location.href = "../pages/financiamiento.html"; });
            return;
        }

        // 3. Intentar como Ciudadano
        const usuario = await iniciarSesion(email, password);
        Swal.fire({ icon: 'success', title: '¡Bienvenido!', text: usuario.nombre, timer: 2000, showConfirmButton: false })
            .then(() => { window.location.href = "../pages/home.html"; });

    } catch (error) {
        console.error("[login.js] Error:", error);
        Swal.fire({
            icon: 'error',
            title: 'Error de autenticación',
            text: error.message || 'Correo o contraseña incorrectos'
        });
    }
});