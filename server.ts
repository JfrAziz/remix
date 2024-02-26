import esbuild from "esbuild";

/**
 * if you want to see entry point
 * of this project, go to `./api/index.ts`.
 * this file just a builder for production
 */
esbuild
  .build({
    // The final file name
    outfile: "build/server/index.js",
    // Our server entry point
    entryPoints: ["api/index.ts"],
    // Dependencies that should not be bundled
    // We import the remix build from "../build/server/remix.js", so no need to bundle it again
    external: ["./build/server/*"],
    platform: "node",
    format: "esm",
    // Don't include node_modules in the bundle
    packages: "external",
    bundle: true,
    logLevel: "info",
  })
  .catch((error: unknown) => {
    console.error(error);
    process.exit(1);
  });
