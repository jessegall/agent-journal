import {defineConfig} from "vitest/config";

export default defineConfig({test: {include: ["tests/figureRead.test.js", "tests/figureReadGeometry.test.js"]}});
