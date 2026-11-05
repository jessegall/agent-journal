import {fileURLToPath} from "node:url";
import {windowBuild} from "../../../../viewer/kit/build.js";

const here = (path) => fileURLToPath(new URL(path, import.meta.url));

export default windowBuild({
    entries: {
        "rule-dock": here("./src/rule-dock.js"),
        "rules": here("./src/rules.js"),
    },
    outDir: here("./dist"),
});
