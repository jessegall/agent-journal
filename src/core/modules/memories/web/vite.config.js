import {fileURLToPath} from "node:url";
import {windowBuild} from "../../../../viewer/kit/build.js";

const here = (path) => fileURLToPath(new URL(path, import.meta.url));

export default windowBuild({
    entries: {
        "memory-dock": here("./src/memory-dock.js"),
    },
    outDir: here("./dist"),
});
