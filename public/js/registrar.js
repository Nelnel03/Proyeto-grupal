import { registrarUsuario } from "../services/servicesUsuarios.js";

const nombre = document.getElementById("nombre");
const apellido = document.getElementById("apellido");
const email = document.getElementById("email");
const password = document.getElementById("password");
const telefono = document.getElementById("telefono");
const btn = document.getElementById("btn");

btn.addEventListener("click", async () => {
    if (!nombre.value || !apellido.value || !email.value || !password.value || !telefono.value) {
        alert("Por favor, completa todos los campos.");
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
        alert("Usuario registrado con éxito");
        window.location.href = "../pages/login.html";
    } catch (error) {
        alert("Error al registrar: " + error.message);
    }
});
