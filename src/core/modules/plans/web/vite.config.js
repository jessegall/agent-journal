import {fileURLToPath} from "node:url";
import {windowBuild} from "../../../../viewer/kit/build.js";

const here = (path) => fileURLToPath(new URL(path, import.meta.url));

export default windowBuild({
    entries: {
        "plans": here("./src/plans.js"),
        "plan-dock": here("./src/plan-dock.js"),
        "plan-details": here("./src/plan-details.js"),
        "plan-phases": here("./src/plan-phases.js"),
        "plan-timeline": here("./src/plan-timeline.js"),
    },
    outDir: here("./dist"),
});
