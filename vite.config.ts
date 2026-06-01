import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import tanstackStart from "@tanstack/react-start/vite";

export default defineConfig({
  base: "/casa_tuiuiu/",
  plugins: [react(), tailwindcss(), tsconfigPaths(), tanstackStart()],
  tanstackStart: {
    server: { entry: "server" },
  },
});
