import {fileURLToPath} from "node:url";
import {windowBuild} from "../../../viewer/kit/build.js";

const here = (path) => fileURLToPath(new URL(path, import.meta.url));

export default windowBuild({
    entries: {
        files: here("./src/files.js"),
        "agent-file-edits": here("./src/agent-file-edits.js"),
        git: here("./src/git.js"),
        "file-feed": here("./src/file-feed.js"),
        "file-edits": here("./src/file-edits.js"),
        terminal: here("./src/terminal.js"),
        "work-mode": here("./src/work-mode.js"),
    },
    outDir: here("./dist"),
});
