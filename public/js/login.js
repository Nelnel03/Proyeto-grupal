import { iniciarSesion } from "../services/servicesUsuarios.js";

const btnIniciarSesion = document.getElementById("bntLogin");
const emailInput = document.getElementById("correo");
const passwordInput = document.getElementById("contraseña");

btnIniciarSesion.addEventListener("click", async () => {
    if (!emailInput.value || !passwordInput.value) {
        alert("Por favor, completa todos los campos.");
        return;
    }
    try {
        const email = emailInput.value;
        const password = passwordInput.value;
        const usuario = await iniciarSesion(email, password);
        console.log("Usuario logueado:", usuario);
    } catch (error) {
        console.error("Error al iniciar sesión:", error);
    }
});