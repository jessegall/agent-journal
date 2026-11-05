import {fileURLToPath} from "node:url";
import {windowBuild} from "../../../../viewer/kit/build.js";

const here = (path) => fileURLToPath(new URL(path, import.meta.url));

export default windowBuild({
    entries: {
        "tasks": here("./src/tasks.js"),
        "task-dock": here("./src/task-dock.js"),
    },
    outDir: here("./dist"),
});
