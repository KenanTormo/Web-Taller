// ===== Cambio de tema claro / oscuro (con memoria) =====
const botonTema = document.getElementById("btn-tema");

// Aplica el tema al body y actualiza el texto del boton
function aplicarTema(oscuro) {
    document.body.classList.toggle("oscuro", oscuro);
    botonTema.textContent = oscuro ? "Tema claro" : "Tema oscuro";
}

// Al cargar la pagina: lee el tema guardado la ultima vez (si existe)
const temaGuardado = localStorage.getItem("tema");
aplicarTema(temaGuardado === "oscuro");

// Al hacer clic: cambia el tema y lo guarda en el navegador
botonTema.addEventListener("click", function () {
    console.log("Clic detectat al botó de tema");

    const ahoraOscuro = !document.body.classList.contains("oscuro");
    aplicarTema(ahoraOscuro);
    localStorage.setItem("tema", ahoraOscuro ? "oscuro" : "claro");

    console.log("Tema actiu:", ahoraOscuro ? "oscuro" : "claro");
});

// ===== Animaciones al hacer scroll =====
// Marca los elementos que apareceran con animacion
const elementos = document.querySelectorAll("#servicios h2, #servicios > p, #servicios h3, article, #solicitud h2, #solicitud > p, form, footer > *");
elementos.forEach(function (el, i) {
    el.classList.add("reveal");
    el.style.setProperty("--d", (i % 3) * 0.15 + "s"); // pequeno retraso escalonado
});

// Cuando un elemento entra en pantalla, se le anade la clase "visible"
const observador = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (entrada) {
        if (entrada.isIntersecting) {
            entrada.target.classList.add("visible");
            observador.unobserve(entrada.target);
        }
    });
}, { threshold: 0.15 });
elementos.forEach(function (el) { observador.observe(el); });

// ===== Barra de progreso de lectura =====
const barra = document.createElement("div");
barra.id = "progreso";
document.body.appendChild(barra);
window.addEventListener("scroll", function () {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    barra.style.width = (window.scrollY / total) * 100 + "%";
});

// ===== Formulario: validacion dentro del evento submit =====
const formulario = document.querySelector("form");

// Pone la vora roja al campo y crea el missatge d'error just a sota
function mostrarError(camp, text) {
    camp.classList.add("error");
    const missatge = document.createElement("p");
    missatge.textContent = text;
    missatge.classList.add("missatge-error");
    camp.after(missatge);
}

// Esborra els errors anteriors perque no s'acumulen
function netejarErrors() {
    document.querySelectorAll(".error").forEach(function (c) { c.classList.remove("error"); });
    document.querySelectorAll(".missatge-error").forEach(function (m) { m.remove(); });
}

formulario.addEventListener("submit", function (event) {
    event.preventDefault();   // la pagina no es recarrega
    netejarErrors();

    // 1. Capturar els camps i els seus valors (sense espais als extrems)
    const campNom = document.getElementById("nombre");
    const campCorreu = document.getElementById("email");
    const campMissatge = document.getElementById("mensaje");

    const nom = campNom.value.trim();
    const correu = campCorreu.value.trim();
    const missatge = campMissatge.value.trim();

    console.log("Valors capturats:", { nom: nom, correu: correu, missatge: missatge });

    // 2. Validar cada dada
    let valid = true;

    if (nom === "") {
        mostrarError(campNom, "El nom és obligatori");
        valid = false;
    }
    if (correu === "") {
        mostrarError(campCorreu, "El correu és obligatori");
        valid = false;
    } else if (!correu.includes("@") || !correu.includes(".")) {
        mostrarError(campCorreu, "El correu ha de contindre una @ i un punt (ex: nom@domini.com)");
        valid = false;
    }
    if (missatge === "") {
        mostrarError(campMissatge, "Descriu l'avaria, el missatge és obligatori");
        valid = false;
    }

    // 3. Resultat
    if (valid) {
        console.log("Formulari VÀLID: dades correctes");
    } else {
        console.log("Formulari amb ERRORS: revisa els camps en roig");
    }
});

// ===== Buscador de servicios: filtra las tarjetas mientras se escribe =====
const buscador = document.getElementById("buscador");
const sinResultados = document.getElementById("sin-resultados");
const targetes = document.querySelectorAll("article");   // todas las tarjetas

buscador.addEventListener("input", function () {
    const cerca = buscador.value.trim().toLowerCase();    // texto buscado en minusculas
    let visibles = 0;

    targetes.forEach(function (targeta) {
        const contingut = targeta.textContent.toLowerCase();

        if (contingut.includes(cerca)) {
            targeta.style.display = "block";   // coincide: se muestra
            visibles++;
        } else {
            targeta.style.display = "none";    // no coincide: se oculta
        }
    });

    // Si no queda ninguna tarjeta, muestra el aviso
    sinResultados.style.display = visibles === 0 ? "block" : "none";
});