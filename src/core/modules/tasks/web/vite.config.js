import {fileURLToPath} from "node:url";
import {windowBuild} from "../../../../viewer/kit/build.js";

const here = (path) => fileURLToPath(new URL(path, import.meta.url));

export default windowBuild({
    entries: {
        "tasks": here("./src/tasks.js"),
        "task-dock": here("./src/task-dock.js"),
        "task-details": here("./src/task-details.js"),
        "task-chain": here("./src/task-chain.js"),
        "task-log": here("./src/task-log.js"),
    },
    outDir: here("./dist"),
});
