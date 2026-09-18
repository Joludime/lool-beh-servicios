/* ==================================================
   ELEMENTOS PRINCIPALES
   ================================================== */

const botonAbrir = document.querySelector("#abrir-formulario");
const botonCerrar = document.querySelector("#cerrar-formulario");
const ventana = document.querySelector("#ventana-cotizacion");
const formulario = document.querySelector("#formulario-cotizacion");
const campoFecha = document.querySelector("#fecha");

const botonEspanol = document.querySelector("#idioma-es");
const botonIngles = document.querySelector("#idioma-en");

const numeroWhatsApp = "527772755235";

let idiomaActual = "es";


/* ==================================================
   EVITAR FECHAS ANTERIORES
   ================================================== */

const hoy = new Date();

const anio = hoy.getFullYear();
const mes = String(hoy.getMonth() + 1).padStart(2, "0");
const dia = String(hoy.getDate()).padStart(2, "0");

campoFecha.min = `${anio}-${mes}-${dia}`;


/* ==================================================
   ABRIR Y CERRAR EL FORMULARIO
   ================================================== */

botonAbrir.addEventListener("click", () => {
    ventana.showModal();
});

botonCerrar.addEventListener("click", () => {
    ventana.close();
});


/* Cerrar al tocar fuera de la ventana */

ventana.addEventListener("click", (evento) => {

    const limites = ventana.getBoundingClientRect();

    const clicDentro =
        evento.clientX >= limites.left &&
        evento.clientX <= limites.right &&
        evento.clientY >= limites.top &&
        evento.clientY <= limites.bottom;

    if (!clicDentro) {
        ventana.close();
    }
});


/* ==================================================
   CAMBIO DE IDIOMA
   ================================================== */

function cambiarIdioma(idioma) {

    idiomaActual = idioma;

    document.documentElement.lang = idioma;

    document
        .querySelectorAll("[data-es][data-en]")
        .forEach((elemento) => {
            elemento.textContent = elemento.dataset[idioma];
        });

    document
        .querySelectorAll(
            "[data-placeholder-es][data-placeholder-en]"
        )
        .forEach((elemento) => {
            elemento.placeholder =
                idioma === "es"
                    ? elemento.dataset.placeholderEs
                    : elemento.dataset.placeholderEn;
        });

    botonEspanol.classList.toggle(
        "activo",
        idioma === "es"
    );

    botonIngles.classList.toggle(
        "activo",
        idioma === "en"
    );

    botonEspanol.setAttribute(
        "aria-pressed",
        String(idioma === "es")
    );

    botonIngles.setAttribute(
        "aria-pressed",
        String(idioma === "en")
    );

    document.title =
        idioma === "es"
            ? "Casa Lool Beh Piscinas"
            : "Casa Lool Beh Pools";
}


botonEspanol.addEventListener("click", () => {
    cambiarIdioma("es");
});


botonIngles.addEventListener("click", () => {
    cambiarIdioma("en");
});


/* ==================================================
   FORMATEAR LA FECHA
   ================================================== */

function formatearFecha(fechaSeleccionada) {

    const fecha = new Date(
        `${fechaSeleccionada}T00:00:00`
    );

    const configuracion = {
        day: "numeric",
        month: "long",
        year: "numeric"
    };

    return fecha.toLocaleDateString(
        idiomaActual === "es" ? "es-MX" : "en-US",
        configuracion
    );
}


/* ==================================================
   NOMBRE DEL HORARIO
   ================================================== */

function obtenerHorario(valor) {

    const horarios = {
        morning: {
            es: "Por la mañana",
            en: "Morning"
        },
        midday: {
            es: "Al mediodía",
            en: "Midday"
        },
        afternoon: {
            es: "Por la tarde",
            en: "Afternoon"
        },
        flexible: {
            es: "Horario flexible",
            en: "Flexible schedule"
        }
    };

    return horarios[valor][idiomaActual];
}


/* ==================================================
   GENERAR MENSAJE DE WHATSAPP
   ================================================== */

formulario.addEventListener("submit", (evento) => {

    evento.preventDefault();

    const nombre =
        document.querySelector("#nombre").value.trim();

    const largo =
        document.querySelector("#largo").value;

    const ancho =
        document.querySelector("#ancho").value;

    const profundidad =
        document.querySelector("#profundidad").value;

    const ubicacion =
        document.querySelector("#ubicacion").value.trim();

    const fecha =
        document.querySelector("#fecha").value;

    const horarioSeleccionado =
        document.querySelector("#horario").value;

    const comentarios =
        document.querySelector("#comentarios").value.trim();

    const fechaFormateada = formatearFecha(fecha);

    const horario = obtenerHorario(horarioSeleccionado);

    let mensaje;

    if (idiomaActual === "en") {

        mensaje = `Hello, José Luis.

I saw the Casa Lool Beh Pools website and would like to request a quote.

CUSTOMER INFORMATION

Name: ${nombre}

APPROXIMATE POOL DIMENSIONS

Length: ${largo} meters
Width: ${ancho} meters
Depth: ${profundidad} meters

LOCATION

Neighborhood or location: ${ubicacion}

PREFERRED DATE AND TIME

Date: ${fechaFormateada}
Time: ${horario}

COMMENTS

${comentarios || "No additional comments."}

I look forward to receiving your quote and availability. Thank you.`;

    } else {

        mensaje = `Hola, José Luis.

Vi la página de Casa Lool Beh Piscinas y me gustaría solicitar una cotización.

DATOS DEL CLIENTE

Nombre: ${nombre}

MEDIDAS APROXIMADAS DE LA PISCINA

Largo: ${largo} metros
Ancho: ${ancho} metros
Profundidad: ${profundidad} metros

UBICACIÓN

Colonia o ubicación: ${ubicacion}

FECHA Y HORARIO PREFERIDOS

Fecha: ${fechaFormateada}
Horario: ${horario}

COMENTARIOS

${comentarios || "Sin comentarios adicionales."}

Quedo pendiente de tu cotización y disponibilidad. Gracias.`;
    }

    const mensajeCodificado = encodeURIComponent(mensaje);

    const enlaceWhatsApp =
        `https://wa.me/${numeroWhatsApp}` +
        `?text=${mensajeCodificado}`;

    window.open(
        enlaceWhatsApp,
        "_blank",
        "noopener,noreferrer"
    );
});