import {fileURLToPath} from "node:url";
import {windowBuild} from "../../../../../viewer/kit/build.js";

const here = (path) => fileURLToPath(new URL(path, import.meta.url));

export default windowBuild({
    entries: {
        checks: here("./src/checks.js"),
    },
    outDir: here("./dist"),
});
