import {fileURLToPath} from "node:url";
import {windowBuild} from "../../../../viewer/kit/build.js";

const here = (path) => fileURLToPath(new URL(path, import.meta.url));

export default windowBuild({
    entries: {
        settings: here("./src/settings.js"),
        project_hooks: here("./src/project_hooks.js"),
    },
    outDir: here("./dist"),
});
