import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    dts({
      include: ["src/**/*"],
      outDir: "dist",
      rollupTypes: true,
    }),
  ],
  build: {
    lib: {
      entry: "src/index.ts",
      name: "MarkdownItInlineCode",
      formats: ["es", "cjs"],
      fileName: (format: string) => `index.${format === "es" ? "js" : "cjs"}`,
    },
    rollupOptions: {
      external: ["markdown-exit", "shiki"],
    },
  },
});
