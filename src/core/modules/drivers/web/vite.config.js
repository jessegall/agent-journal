import {fileURLToPath} from "node:url";
import {windowBuild} from "../../../../viewer/kit/build.js";

const here = (path) => fileURLToPath(new URL(path, import.meta.url));

export default windowBuild({
    entries: {
        "hook-calls": here("./src/hook-calls.js"),
        nudges: here("./src/nudges.js"),
    },
    outDir: here("./dist"),
});
