document.addEventListener("DOMContentLoaded", () => {
    const botonAbrir = document.getElementById("abrir-contacto");
    const ventana = document.getElementById("ventana-contacto");
    const botonCerrar = document.getElementById("cerrar-contacto");
    const consulta = document.getElementById("consulta-contacto");
    const explorar = document.getElementById("explorar-servicios");

    // Evita errores mientras añadimos el formulario al HTML.
    if (!botonAbrir || !ventana || !botonCerrar || !consulta) {
        return;
    }

    const contactos = {
        jose: "527772755235",
        ananda: "525585375197"
    };

    function actualizarMensajes() {
        const texto = consulta.value.trim();

        let mensaje =
            "Hola, vi la página de Lool Beh Servicios " +
            "y quisiera más información.";

        if (texto) {
            mensaje += "\n\nMi consulta es: " + texto;
        }

        ventana.querySelectorAll("[data-contacto]").forEach((enlace) => {
            const telefono = contactos[enlace.dataset.contacto];

            if (telefono) {
                enlace.href =
                    "https://wa.me/" +
                    telefono +
                    "?text=" +
                    encodeURIComponent(mensaje);
            }
        });
    }

    botonAbrir.addEventListener("click", () => {
        actualizarMensajes();

        if (!ventana.open) {
            ventana.showModal();
            consulta.focus();
        }
    });

    botonCerrar.addEventListener("click", () => {
        ventana.close();
    });

    consulta.addEventListener("input", actualizarMensajes);

    ventana.addEventListener("close", () => {
        botonAbrir.focus();
    });

    if (explorar) {
        explorar.addEventListener("click", () => {
            ventana.close();
        });
    }

    actualizarMensajes();
});