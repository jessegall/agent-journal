import {fileURLToPath} from "node:url";
import {windowBuild} from "../../../../viewer/kit/build.js";

const here = (path) => fileURLToPath(new URL(path, import.meta.url));

export default windowBuild({
    entries: {
        "agents": here("./src/agents.js"),
        "subagents": here("./src/subagents.js"),
        "transcript": here("./src/transcript.js"),
    },
    outDir: here("./dist"),
});
