import {fileURLToPath} from "node:url";
import {windowBuild} from "../../../../viewer/kit/build.js";

const here = (path) => fileURLToPath(new URL(path, import.meta.url));

export default windowBuild({
    entries: {
        "plans": here("./src/plans.js"),
        "plan-dock": here("./src/plan-dock.js"),
    },
    outDir: here("./dist"),
});
