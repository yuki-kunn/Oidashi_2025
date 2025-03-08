import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import env from "vite-plugin-env-compatible";

export default defineConfig({
	plugins: [sveltekit(), tailwindcss(), env({ prefix: "VITE", mountedPath: "process.env" })]
});
