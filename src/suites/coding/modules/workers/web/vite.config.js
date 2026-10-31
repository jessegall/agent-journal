import {fileURLToPath} from "node:url";
import {windowBuild} from "../../../../../viewer/kit/build.js";

const here = (path) => fileURLToPath(new URL(path, import.meta.url));

export default windowBuild({
    entries: {
        points: here("./src/points.js"),
        todos: here("./src/todos.js"),
    },
    outDir: here("./dist"),
});
