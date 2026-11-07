import {fileURLToPath} from "node:url";
import {windowBuild} from "../../../../viewer/kit/build.js";

const here = (path) => fileURLToPath(new URL(path, import.meta.url));

export default windowBuild({
    entries: {
        "dump-dock": here("./src/dump-dock.js"),
        dumps: here("./src/dumps.js"),
    },
    outDir: here("./dist"),
});
