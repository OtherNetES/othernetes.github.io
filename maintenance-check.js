// Para activarlo, cambiar "enabled" a true en maintenance.json.
// Para desactivarlo, vuelve a cambiarlo a false.
(async function () {
    const paginaMantenimiento = "mantenimiento.html";

    if (window.location.pathname.endsWith("/" + paginaMantenimiento) ||
        window.location.pathname === paginaMantenimiento) {
        return;
    }

    try {
        const respuesta = await fetch("./maintenance.json?ts=" + Date.now(), {
            cache: "no-store"
        });

        if (!respuesta.ok) return;

        const config = await respuesta.json();

        if (config.enabled === true) {
            window.location.replace(paginaMantenimiento);
        }
    } catch (error) {
        // Si el archivo no está disponible, la web normal sigue funcionando.
        console.warn("No se pudo comprobar el modo mantenimiento.", error);
    }
})();
