import {fileURLToPath} from "node:url";
import {windowBuild} from "../../../../viewer/kit/build.js";

const here = (path) => fileURLToPath(new URL(path, import.meta.url));

export default windowBuild({
    entries: {
        "reviewer": here("./src/reviewer.js"),
        reviewers: here("./src/reviewers.js"),
        "subject-reviews": here("./src/subject-reviews.js"),
    },
    outDir: here("./dist"),
});
