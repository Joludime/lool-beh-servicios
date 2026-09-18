document.addEventListener("DOMContentLoaded", () => {
    let idiomaActual = "es";

    const botonAbrir = document.getElementById("abrir-contacto");
    const ventana = document.getElementById("ventana-contacto");
    const botonCerrar = document.getElementById("cerrar-contacto");
    const consulta = document.getElementById("consulta-contacto");
    const explorar = document.getElementById("explorar-servicios");

    const contactos = {
        jose: "527772755235",
        ananda: "525585375197"
    };

    // Cada texto original en español se conserva automáticamente.
    const traducciones = [
        [".portada__frase",
            "Friendly, reliable services for you and your loved ones."],
        [".portada .contenedor > .boton",
            "Explore our services"],
        ["#titulo-servicios",
            "Our services"],
        [".servicios__introduccion",
            "Select a service to discover how we can help."],
        ["#abrir-contacto",
            "WhatsApp · Contact us"],
        ["#titulo-contacto",
            "Hello! How can we help you?"],
        ["#ventana-contacto > p:first-of-type",
            "Tell us which service you need or write your question. We’ll be happy to help."],
        ["#explorar-servicios",
            "You can also explore our services on this page for more details."],
        ['label[for="consulta-contacto"]',
            "Write your question here"],
        ['[data-contacto="jose"]',
            "WhatsApp José Luis"],
        ['[data-contacto="ananda"]',
            "WhatsApp Ananda"],
        [".contacto-aviso",
            "You can review your message in WhatsApp before sending it."]
    ];

    const serviciosEnIngles = [
        {
            nombre: "Pool cleaning and vacuuming",
            descripcion:
                "Residential pool cleaning and vacuuming in Mérida. " +
                "Explore our services and request a quote based on " +
                "your pool’s size and condition.",
            boton: "View service and request a quote"
        },
        {
            nombre: "Transfers",
            descripcion:
                "Airport transfers, trips within Mérida and journeys " +
                "to destinations outside the city.",
            aviso:
                "Service details and quote requests will be available here soon."
        },
        {
            nombre: "Accommodation",
            descripcion:
                "Check availability and book directly with us at Casa Lool Beh.",
            aviso:
                "We’re preparing this section with information for your stay."
        },
        {
            nombre: "In-home dog care",
            descripcion:
                "Responsible care for your dogs in the comfort of your home.",
            aviso:
                "Service details and information on requesting a quote " +
                "will be available here soon."
        }
    ];

    function prepararTexto(elemento, ingles) {
        if (!elemento) return;

        elemento.dataset.es = elemento.textContent.trim();
        elemento.dataset.en = ingles;
    }

    // Conserva el enlace de explorar sin mezclar idiomas.
    if (explorar) {
        explorar.textContent =
            "También puedes explorar nuestros servicios en esta página " +
            "para conocer más detalles.";

        explorar.parentElement.replaceChildren(explorar);
    }

    traducciones.forEach(([selector, ingles]) => {
        prepararTexto(document.querySelector(selector), ingles);
    });

    document.querySelectorAll(".servicio").forEach((servicio, indice) => {
        const textos = serviciosEnIngles[indice];
        if (!textos) return;

        prepararTexto(
            servicio.querySelector(".servicio__nombre"),
            textos.nombre
        );

        prepararTexto(
            servicio.querySelector(".servicio__contenido > p"),
            textos.descripcion
        );

        if (textos.boton) {
            prepararTexto(
                servicio.querySelector(".servicio__contenido .boton"),
                textos.boton
            );
        }

        if (textos.aviso) {
            prepararTexto(
                servicio.querySelector(".servicio__aviso"),
                textos.aviso
            );
        }
    });

    function actualizarMensajes() {
        const texto = consulta ? consulta.value.trim() : "";

        let mensaje = idiomaActual === "en"
            ? "Hello, I visited the Lool Beh Servicios website and would like more information."
            : "Hola, vi la página de Lool Beh Servicios y quisiera más información.";

        if (texto) {
            mensaje += idiomaActual === "en"
                ? "\n\nMy enquiry: " + texto
                : "\n\nMi consulta es: " + texto;
        }

        document.querySelectorAll("[data-contacto]").forEach((enlace) => {
            const telefono = contactos[enlace.dataset.contacto];

            if (telefono) {
                enlace.href =
                    "https://wa.me/" + telefono +
                    "?text=" + encodeURIComponent(mensaje);
            }
        });
    }

    function cambiarIdioma(idioma) {
        idiomaActual = idioma === "en" ? "en" : "es";
        document.documentElement.lang = idiomaActual;

        document.querySelectorAll("[data-es][data-en]").forEach((elemento) => {
            elemento.textContent = elemento.dataset[idiomaActual];
        });

        document.querySelectorAll("[data-idioma]").forEach((boton) => {
            const seleccionado = boton.dataset.idioma === idiomaActual;
            boton.setAttribute("aria-pressed", String(seleccionado));
            boton.classList.toggle("activo", seleccionado);
        });

        if (consulta) {
            consulta.placeholder = idiomaActual === "en"
                ? "For example: I need an airport transfer…"
                : "Por ejemplo: necesito un traslado al aeropuerto…";
        }

        if (botonCerrar) {
            botonCerrar.setAttribute(
                "aria-label",
                idiomaActual === "en"
                    ? "Close contact window"
                    : "Cerrar ventana de contacto"
            );
        }

        const descripcion = document.querySelector('meta[name="description"]');

        if (descripcion) {
            descripcion.content = idiomaActual === "en"
                ? "Lool Beh services in Mérida: pool cleaning, transfers, accommodation and in-home dog care."
                : "Lool Beh Servicios en Mérida: limpieza de piscinas, traslados, hospedaje y cuidado de perros a domicilio.";
        }

        actualizarMensajes();

        try {
            localStorage.setItem("lool-beh-idioma", idiomaActual);
        } catch {
            // El selector funciona aunque el navegador impida guardar preferencias.
        }
    }

    document.querySelectorAll("[data-idioma]").forEach((boton) => {
        boton.addEventListener("click", () => {
            cambiarIdioma(boton.dataset.idioma);
        });
    });

    if (botonAbrir && ventana && botonCerrar && consulta) {
        botonAbrir.addEventListener("click", () => {
            actualizarMensajes();

            if (!ventana.open) {
                ventana.showModal();
                consulta.focus();
            }
        });

        botonCerrar.addEventListener("click", () => ventana.close());
        consulta.addEventListener("input", actualizarMensajes);

        ventana.addEventListener("close", () => {
            botonAbrir.focus();
        });

        if (explorar) {
            explorar.addEventListener("click", () => ventana.close());
        }
    }

    let idiomaGuardado = "es";

    try {
        idiomaGuardado = localStorage.getItem("lool-beh-idioma") || "es";
    } catch {
        // Español como idioma inicial.
    }

    cambiarIdioma(idiomaGuardado);
});