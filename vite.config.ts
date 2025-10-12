import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import {resolve} from "path";
import viteTsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), viteTsconfigPaths()],
  resolve: {
    alias: {
      "~": resolve(__dirname, "src"),
    },
  },
})
