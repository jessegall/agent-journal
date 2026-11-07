import {fileURLToPath} from "node:url";
import {windowBuild} from "../../../../../viewer/kit/build.js";

const here = (path) => fileURLToPath(new URL(path, import.meta.url));

export default windowBuild({
    entries: {
        points: here("./src/points.js"),
        todos: here("./src/todos.js"),
        models: here("./src/models.js"),
        workers: here("./src/workers.js"),
        worktrees: here("./src/worktrees.js"),
    },
    outDir: here("./dist"),
});
