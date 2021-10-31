import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const isProd = mode === "production";

  return {
    plugins: [
      svelte({
        hot: !isProd,
      }),
    ],
  };
});
