import esbuild from "esbuild";
import { GasPlugin } from "esbuild-gas-plugin";

esbuild.build({
    entryPoints: ["src/main.ts"],
    bundle: true,
    outfile: "dist/main.js",
    target: "es2021", // GASの処理系の仕様に合わせる
    plugins: [GasPlugin],
}).catch(() => process.exit(1));
