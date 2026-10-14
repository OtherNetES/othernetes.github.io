import { defineConfig } from "vite";

export default defineConfig({
    base: "./",
    publicDir: "public",
    build: {
        outDir: "dist",
        emptyOutDir: true,
        rollupOptions: {
            input: {
                index: "index.html",
                mantenimiento: "mantenimiento.html"
            }
        }
    }
});
