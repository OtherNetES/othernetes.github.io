interface MaintenanceConfig {
    enabled?: boolean;
    title?: string;
    message?: string;
    estimatedReturn?: string;
}

async function loadMaintenanceText(): Promise<void> {
    const title = document.getElementById("titulo");
    const message = document.getElementById("mensaje");
    const estimatedReturn = document.getElementById("estimacion");

    if (!title || !message || !estimatedReturn) return;

    try {
        const response = await fetch(`maintenance.json?ts=${Date.now()}`, { cache: "no-store" });
        if (!response.ok) return;

        const config: MaintenanceConfig = await response.json();

        if (typeof config.title === "string" && config.title.trim()) {
            title.textContent = config.title;
            document.title = `${config.title} · OtherNetES`;
        }
        if (typeof config.message === "string" && config.message.trim()) {
            message.textContent = config.message;
        }
        if (typeof config.estimatedReturn === "string" && config.estimatedReturn.trim()) {
            estimatedReturn.textContent = config.estimatedReturn;
        }
    } catch (error: unknown) {
        console.warn("Se mostrarán los textos de mantenimiento predeterminados.", error);
    }
}

void loadMaintenanceText();
