import {fileURLToPath} from "node:url";
import {windowBuild} from "../../../../viewer/kit/build.js";

const here = (path) => fileURLToPath(new URL(path, import.meta.url));

export default windowBuild({
    entries: {
        search: here("./src/search.js"),
        "search-mark": here("./src/search-mark.js"),
    },
    outDir: here("./dist"),
});
