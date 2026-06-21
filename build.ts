import esbuild from "esbuild";
import GasPlugin from "esbuild-plugin-gas-generator";

esbuild.build({
    entryPoints: ["src/main.ts"],
    bundle: true,
    format: "iife",
    metafile: true,
    outfile: "dist/main.js",
    target: "es2021",
    plugins: [GasPlugin({ appsscript: "appsscript.json" })],
}).catch(() => process.exit(1));
