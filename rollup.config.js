import dts from "rollup-plugin-dts";
import esbuild from "rollup-plugin-esbuild";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import globals from "rollup-plugin-node-globals";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";

const name = "vallaris-js";

const bundles = [
  // ES module, not minified + sourcemap
  {
    plugins: [json(), esbuild()],
    output: [
      {
        file: `dist/${name}.mjs`,
        format: "es",
        sourcemap: true,
      },
    ],
    input: "src/index.ts",
    watch: {
      include: "src/**",
    },
    external: [],
  },

  // CJS module, not minified + sourcemap
  {
    plugins: [
      nodeResolve(),
      commonjs({ include: "node_modules/**" }),
      globals(),
      json(),
      esbuild(),
    ],
    output: [
      {
        file: `dist/${name}.cjs`,
        format: "cjs",
        sourcemap: true,
      },
    ],
    input: "src/index.ts",
    watch: {
      include: "src/**",
    },
    external: [],
  },

  // UMD module, not minified
  {
    plugins: [
      nodeResolve(), // for the standalone UMD, we want to resolve so that the bundle contains all the dep.
      commonjs({ include: "node_modules/**" }),
      globals(),
      json(),
      esbuild(),
    ],
    output: [
      {
        name: "vallarisJS",
        file: `dist/${name}.umd.js`,
        format: "umd",
        sourcemap: true,
      },
    ],
    input: "src/index.ts",
    watch: {
      include: "src/**",
    },
    external: [],
  },

  // types
  {
    plugins: [dts()],
    output: {
      file: `dist/${name}.d.ts`,
      format: "es",
    },
    input: "src/index.ts",
  },
];

export default bundles;
