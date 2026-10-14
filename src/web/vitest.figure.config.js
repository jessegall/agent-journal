import {defineConfig} from "vitest/config";

export default defineConfig({test: {fileParallelism: false, include: ["tests/figureRead.test.js", "tests/figureReadGeometry.test.js", "tests/figureCollision.test.js"]}});
