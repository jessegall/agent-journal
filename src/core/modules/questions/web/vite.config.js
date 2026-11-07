import {fileURLToPath} from "node:url";
import {windowBuild} from "../../../../viewer/kit/build.js";

const here = (path) => fileURLToPath(new URL(path, import.meta.url));

export default windowBuild({
    entries: {
        "question-dock": here("./src/question-dock.js"),
        "question-card": here("./src/question-card.js"),
        "open-questions-dock": here("./src/open-questions-dock.js"),
        questions: here("./src/questions.js"),
        waiting: here("./src/waiting.js"),
    },
    outDir: here("./dist"),
});
