import { obtenerPlanillas } from "../services/servicesPlanillas.js";

async function cargarVistaPublica() {
    const contenedor = document.getElementById("contenedor-planilla-publica");

    try {
        const planillas = await obtenerPlanillas();

        if (planillas.length === 0) {
            contenedor.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 40px; background: white; border-radius: 15px;">
                    <i class="ri-information-line" style="font-size: 3rem; color: #3498db;"></i>
                    <p style="font-size: 1.1rem; margin-top: 15px; color: #555;">No hay información disponible en este momento.</p>
                </div>
            `;
            return;
        }

        contenedor.innerHTML = "";

        // Estilos para el grid (podrían ir en CSS, pero los mantengo inline para rapidez)
        contenedor.style.display = "grid";
        contenedor.style.gridTemplateColumns = "repeat(auto-fill, minmax(300px, 1fr))";
        contenedor.style.gap = "30px";
        contenedor.style.marginTop = "40px";

        planillas.forEach(p => {
            const card = document.createElement("div");
            card.className = "tarjeta-empleado-publica";
            card.style.background = "white";
            card.style.padding = "25px";
            card.style.borderRadius = "20px";
            card.style.boxShadow = "0 10px 30px rgba(0,0,0,0.05)";
            card.style.display = "flex";
            card.style.flexDirection = "column";
            card.style.alignItems = "center";
            card.style.textAlign = "center";
            card.style.transition = "transform 0.3s ease";

            card.onmouseover = () => card.style.transform = "translateY(-10px)";
            card.onmouseout = () => card.style.transform = "translateY(0)";

            card.innerHTML = `
                <div class="empleado-foto" style="margin-bottom: 20px;">
                    <img src="${p.imagen || '../imgs/avatar-default.png'}" alt="Foto de ${p.empleado}" 
                         style="width: 120px; height: 120px; border-radius: 50%; object-fit: cover; border: 4px solid #003366; box-shadow: 0 5px 15px rgba(0,51,102,0.15);">
                </div>
                <div class="empleado-info">
                    <h2 style="margin: 0; color: #003366; font-size: 1.5rem;">${p.empleado}</h2>
                    <h3 style="margin: 8px 0; color: #27ae60; font-weight: 500; font-size: 1.1rem;">${p.puesto}</h3>
                    <p style="margin: 5px 0; color: #888; text-transform: uppercase; font-size: 0.8rem; letter-spacing: 1px;">
                        ${p.departamento}
                    </p>
                    <hr style="width: 40px; margin: 15px auto; border: 0; border-top: 2px solid #27ae60;">
                    <p style="margin: 0; color: #555; line-height: 1.5; font-size: 0.95rem;">
                        ${p.descripcion || 'Personal de la Municipalidad de Puntarenas.'}
                    </p>
                </div>
            `;
            contenedor.appendChild(card);
        });

    } catch (error) {
        console.error("Error al cargar planilla:", error);
        contenedor.innerHTML = "<p style='text-align:center; color: red;'>Error al cargar los datos del personal.</p>";
    }
}

document.addEventListener("DOMContentLoaded", cargarVistaPublica);
