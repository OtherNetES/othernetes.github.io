const ACCESS_KEY = "62bdac7d-ab65-4d2e-a93f-e7635a89187e";
const ENDPOINT = "https://api.web3forms.com/submit";
const ESPERA_MS = 30_000;
const MIN_MSG = 10;
const CORREO_EQUIPO = "othernetes@gmail.com";

const byId = <T extends HTMLElement>(id: string): T => {
    const element = document.getElementById(id);
    if (!element) throw new Error(`No se encontró el elemento #${id}`);
    return element as T;
};

const form = byId<HTMLFormElement>("formulario");
const btn = byId<HTMLButtonElement>("enviar");
const aviso = byId<HTMLParagraphElement>("resultado");
const ok = byId<HTMLDivElement>("ok");
const msg = byId<HTMLTextAreaElement>("mensaje");
const contador = byId<HTMLSpanElement>("contador");
const planb = byId<HTMLAnchorElement>("planb");
const nombre = byId<HTMLInputElement>("nombre");
const email = byId<HTMLInputElement>("email");
const asunto = byId<HTMLInputElement>("asunto");
const botcheck = byId<HTMLInputElement>("botcheck");
const okCorreo = byId<HTMLElement>("okCorreo");
const otro = byId<HTMLButtonElement>("otro");
const textoBoton = btn.querySelector<HTMLElement>(".txt");

function mostrarPlanB(): void {
    const cuerpo = `Nombre: ${nombre.value.trim()}\nCorreo: ${email.value.trim()}\n\n${msg.value.trim()}`;
    planb.href = `mailto:${CORREO_EQUIPO}?subject=${encodeURIComponent(asunto.value.trim())}&body=${encodeURIComponent(cuerpo)}`;
    planb.hidden = false;
}

function mostrarMensaje(texto: string, error = false): void {
    aviso.textContent = texto;
    aviso.classList.toggle("mal", error);
}

function validar(element: HTMLInputElement | HTMLTextAreaElement): boolean {
    const valor = element.value.trim();
    const valido = element.id === "mensaje"
        ? valor.length >= MIN_MSG
        : valor !== "" && element.checkValidity();

    element.closest(".campo")?.classList.toggle("mal", !valido);
    return valido;
}

msg.addEventListener("input", () => {
    contador.textContent = `${msg.value.length} / 2000`;
});

form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>("[required]").forEach((element) => {
    element.addEventListener("blur", () => {
        if (element.value) validar(element);
    });
    element.addEventListener("input", () => {
        if (element.closest(".campo")?.classList.contains("mal")) validar(element);
    });
});

form.addEventListener("submit", async (event: SubmitEvent) => {
    event.preventDefault();
    mostrarMensaje("");
    planb.hidden = true;

    if (botcheck.checked) {
        mostrarMensaje("No se pudo enviar. Recarga la página e inténtalo de nuevo.", true);
        return;
    }

    const campos = Array.from(form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>("[required]"));
    const primeroInvalido = campos.find((element) => !validar(element));
    if (primeroInvalido) {
        primeroInvalido.focus();
        mostrarMensaje("Revisa los campos marcados en rojo.", true);
        return;
    }

    if (ACCESS_KEY.startsWith("PEGA_")) {
        mostrarMensaje("Falta configurar la access key en src/contact.ts.", true);
        return;
    }

    let ultimoEnvio = 0;
    try {
        ultimoEnvio = Number(localStorage.getItem("on_ultimo") || 0);
    } catch {
        // El navegador puede bloquear localStorage; el envío puede continuar.
    }

    if (Date.now() - ultimoEnvio < ESPERA_MS) {
        mostrarMensaje("Espera unos segundos antes de enviar otro mensaje.", true);
        return;
    }

    const tipoSeleccionado = form.querySelector<HTMLInputElement>('input[name="tipo"]:checked');
    const tipo = tipoSeleccionado?.value ?? "Otro";
    const correo = email.value.trim();

    btn.disabled = true;
    btn.classList.add("cargando");
    if (textoBoton) textoBoton.textContent = "Enviando…";

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 20_000);

    try {
        const response = await fetch(ENDPOINT, {
            method: "POST",
            signal: controller.signal,
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                access_key: ACCESS_KEY,
                from_name: "Web OtherNet",
                subject: `[OtherNet · ${tipo}] ${asunto.value.trim()}`,
                name: nombre.value.trim(),
                email: correo,
                replyto: correo,
                tipo,
                message: msg.value.trim(),
                botcheck: ""
            })
        });

        let data: { success?: boolean; message?: string } = {};
        try {
            data = await response.json() as { success?: boolean; message?: string };
        } catch {
            // Se gestiona como respuesta no válida abajo.
        }

        if (!response.ok || !data.success) {
            throw new Error(data.message || `Error ${response.status}`);
        }

        try {
            localStorage.setItem("on_ultimo", String(Date.now()));
        } catch {
            // El limitador local no está disponible en este navegador.
        }

        okCorreo.textContent = correo;
        form.hidden = true;
        ok.hidden = false;
        form.reset();
        contador.textContent = "0 / 2000";
    } catch (error: unknown) {
        let reason = "error inesperado";
        if (error instanceof DOMException && error.name === "AbortError") {
            reason = "tardó demasiado";
        } else if (error instanceof TypeError) {
            reason = "sin conexión o bloqueado por tu red o bloqueador de anuncios";
        } else if (error instanceof Error) {
            reason = error.message;
        }

        mostrarMensaje(`No se pudo enviar (${reason}).`, true);
        mostrarPlanB();
        console.error(error);
    } finally {
        window.clearTimeout(timeout);
        btn.disabled = false;
        btn.classList.remove("cargando");
        if (textoBoton) textoBoton.textContent = "Enviar mensaje";
    }
});

otro.addEventListener("click", () => {
    ok.hidden = true;
    form.hidden = false;
    mostrarMensaje("");
    planb.hidden = true;
    nombre.focus();
});
