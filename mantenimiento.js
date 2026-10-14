// Personaliza los textos desde maintenance.json sin editar esta página.
(async function () {
    try {
        const respuesta = await fetch("./maintenance.json?ts=" + Date.now(), {
            cache: "no-store"
        });
        if (!respuesta.ok) return;

        const config = await respuesta.json();
        if (typeof config.title === "string" && config.title.trim()) {
            document.getElementById("titulo").textContent = config.title;
            document.title = config.title + " · OtherNetES";
        }
        if (typeof config.message === "string" && config.message.trim()) {
            document.getElementById("mensaje").textContent = config.message;
        }
        if (typeof config.estimatedReturn === "string" && config.estimatedReturn.trim()) {
            document.getElementById("estimacion").textContent = config.estimatedReturn;
        }
    } catch (error) {
        console.warn("Se mostrarán los textos de mantenimiento predeterminados.", error);
    }
})();
