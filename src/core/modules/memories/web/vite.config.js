import {fileURLToPath} from "node:url";
import {windowBuild} from "../../../../viewer/kit/build.js";

const here = (path) => fileURLToPath(new URL(path, import.meta.url));

export default windowBuild({
    entries: {
        "memory-dock": here("./src/memory-dock.js"),
        "memory-round": here("./src/memory-round.js"),
        "memories": here("./src/memories.js"),
        "memory-facts": here("./src/memory-facts.js"),
        "agent-memories": here("./src/agent-memories.js"),
    },
    outDir: here("./dist"),
});
