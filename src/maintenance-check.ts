interface MaintenanceConfig {
    enabled?: boolean;
    title?: string;
    message?: string;
    estimatedReturn?: string;
}

const MAINTENANCE_PAGE = "mantenimiento.html";
const CONFIG_FILE = "maintenance.json";

async function checkMaintenanceMode(): Promise<void> {
    const path = window.location.pathname;
    if (path.endsWith(`/${MAINTENANCE_PAGE}`) || path === MAINTENANCE_PAGE) return;

    try {
        const response = await fetch(`${CONFIG_FILE}?ts=${Date.now()}`, { cache: "no-store" });
        if (!response.ok) return;

        const config: MaintenanceConfig = await response.json();
        if (config.enabled === true) {
            window.location.replace(MAINTENANCE_PAGE);
        }
    } catch (error: unknown) {
        // Si la configuración no está disponible, no bloqueamos la web.
        console.warn("No se pudo comprobar el modo mantenimiento.", error);
    }
}

void checkMaintenanceMode();
