import {fileURLToPath} from "node:url";
import {windowBuild} from "../../../../viewer/kit/build.js";

const here = (path) => fileURLToPath(new URL(path, import.meta.url));

export default windowBuild({
    entries: {
        numbers: here("./src/numbers.js"),
        hookRequests: here("./src/hookRequests.js"),
        systemLogs: here("./src/systemLogs.js"),
    },
    outDir: here("./dist"),
});
