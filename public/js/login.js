import { iniciarSesion } from "../services/servicesUsuarios.js";
import { iniciarSesionAdmin } from "../services/servicesAdmin.js";

const btnIniciarSesion = document.getElementById("bntLogin");
const emailInput = document.getElementById("correo");
const passwordInput = document.getElementById("contraseña");

btnIniciarSesion.addEventListener("click", async () => {
    if (!emailInput.value || !passwordInput.value) {
        alert("Por favor, completa todos los campos.");
        return;
    }

    const email = emailInput.value;
    const password = passwordInput.value;

    try {
        const admin = await iniciarSesionAdmin(email, password);

        if (admin) {
            alert("Bienvenido Administrador, " + admin.nombre);
            window.location.href = "../pages/admin.html";
            return;
        }

        const usuario = await iniciarSesion(email, password);
        alert("Bienvenido, " + usuario.nombre);
        window.location.href = "../pages/user.html";

    } catch (error) {
        alert("Correo o contraseña incorrectos");
    }
});