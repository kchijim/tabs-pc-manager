import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";
import styleImport from "vite-plugin-style-import";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  return {
    plugins: [
      reactRefresh(),
      // https://github.com/anncwb/vite-plugin-style-import
      // 按需引入 import { Button } from 'antd' => 导入对应index.js和css.js
      styleImport({
        libs: [
          {
            libraryName: "antd",
            esModule: true,
            resolveStyle: (name) => `antd/es/${name}/style/index.js`,
            resolveComponent: (name) => `antd/es/${name}/index`,
          },
        ],
      }),
    ],
    server: {
      proxy: {},
    },
    css: {
      preprocessorOptions: {
        less: {
          // 支持内联 JavaScript
          javascriptEnabled: true,
        },
      },
      modules: {
        generateScopedName: "[name]__[local]___[hash:base64:5]",
      },
    },
    build: {
      outDir: "dist",
    },
    resolve: {
      alias: [
        {
          find: /^~/,
          replacement: "",
        },
        {
          find: "@",
          replacement: path.join(__dirname, "src"),
        },
      ],
    },
    base: command === "build" ? "/manager/" : "/",
    optimizeDeps: {
      include: ["react", "react-dom", "react-router-dom"],
    },
  };
});
