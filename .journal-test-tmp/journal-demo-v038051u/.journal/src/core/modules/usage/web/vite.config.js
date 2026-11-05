import {fileURLToPath} from "node:url";
import {windowBuild} from "../../../../viewer/kit/build.js";

const here = (path) => fileURLToPath(new URL(path, import.meta.url));

export default windowBuild({
    entries: {
        usage: here("./src/usage.js"),
        context: here("./src/context.js"),
        cost: here("./src/cost.js"),
        fitness: here("./src/fitness.js"),
        load: here("./src/load.js"),
    },
    outDir: here("./dist"),
});
