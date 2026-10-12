const ACCESS_KEY = "62bdac7d-ab65-4d2e-a93f-e7635a89187e";
const ENDPOINT = "https://api.web3forms.com/submit";
const ESPERA_MS = 30000; // anti-spam: 1 envío cada 30 s por navegador

const $ = (id) => document.getElementById(id);
const form = $("formulario");
const btn = $("enviar");
const aviso = $("resultado");
const ok = $("ok");
const msg = $("mensaje");
const contador = $("contador");
const MIN_MSG = 10;

msg.addEventListener("input", () => {
    contador.textContent = msg.value.length + " / 2000";
});

function validar(el) {
    const v = el.value.trim();
    const bien = el.id === "mensaje" ? v.length >= MIN_MSG
               : v !== "" && el.checkValidity();
    el.closest(".campo").classList.toggle("mal", !bien);
    return bien;
}

form.querySelectorAll("[required]").forEach((el) => {
    el.addEventListener("blur", () => { if (el.value) validar(el); });
    el.addEventListener("input", () => {
        if (el.closest(".campo").classList.contains("mal")) validar(el);
    });
});

function mensaje(texto, malo) {
    aviso.textContent = texto;
    aviso.classList.toggle("mal", !!malo);
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    mensaje("");

    if ($("botcheck").checked) return; // bot

    const campos = [...form.querySelectorAll("[required]")];
    const primero = campos.filter((el) => !validar(el))[0];
    if (primero) {
        primero.focus();
        return mensaje("Revisa los campos marcados en rojo.", true);
    }

    if (ACCESS_KEY.startsWith("PEGA_")) {
        return mensaje("Falta configurar la access key en script.js.", true);
    }

    let ultimo = 0;
    try { ultimo = Number(localStorage.getItem("on_ultimo") || 0); } catch (_) {}
    if (Date.now() - ultimo < ESPERA_MS) {
        return mensaje("Espera unos segundos antes de enviar otro mensaje.", true);
    }

    const tipo = form.querySelector('input[name="tipo"]:checked').value;
    const correo = $("email").value.trim();

    btn.disabled = true;
    btn.classList.add("cargando");
    btn.querySelector(".txt").textContent = "Enviando…";

    try {
        const r = await fetch(ENDPOINT, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Accept": "application/json" },
            body: JSON.stringify({
                access_key: ACCESS_KEY,
                from_name: "Web OtherNet",
                subject: "[OtherNet · " + tipo + "] " + $("asunto").value.trim(),
                name: $("nombre").value.trim(),
                email: correo,
                replyto: correo,
                tipo: tipo,
                message: msg.value.trim(),
                botcheck: ""
            })
        });
        const d = await r.json();
        if (!r.ok || !d.success) throw new Error(d.message || "Error " + r.status);

        try { localStorage.setItem("on_ultimo", Date.now()); } catch (_) {}
        $("okCorreo").textContent = correo;
        form.hidden = true;
        ok.hidden = false;
        form.reset();
        contador.textContent = "0 / 2000";
    } catch (err) {
        mensaje("No se pudo enviar. Inténtalo de nuevo en un momento.", true);
        console.error(err);
    } finally {
        btn.disabled = false;
        btn.classList.remove("cargando");
        btn.querySelector(".txt").textContent = "Enviar mensaje";
    }
});

$("otro").addEventListener("click", () => {
    ok.hidden = true;
    form.hidden = false;
    mensaje("");
    $("nombre").focus();
});
