import {fileURLToPath} from "node:url";
import {windowBuild} from "../../../viewer/kit/build.js";

const here = (path) => fileURLToPath(new URL(path, import.meta.url));

export default windowBuild({
    entries: {
        "file-feed": here("./src/file-feed.js"),
        "file-edits": here("./src/file-edits.js"),
        terminal: here("./src/terminal.js"),
    },
    outDir: here("./dist"),
});
