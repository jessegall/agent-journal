import {fileURLToPath} from "node:url";
import {windowBuild} from "../../../../viewer/kit/build.js";

const here = (path) => fileURLToPath(new URL(path, import.meta.url));

export default windowBuild({
    entries: {
        "outputs": here("./src/outputs.js"),
        "output": here("./src/output.js"),
        "output-dock": here("./src/output-dock.js"),
    },
    outDir: here("./dist"),
});
