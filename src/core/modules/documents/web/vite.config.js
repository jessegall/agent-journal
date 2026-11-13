import {fileURLToPath} from "node:url";
import {windowBuild} from "../../../../viewer/kit/build.js";

const here = (path) => fileURLToPath(new URL(path, import.meta.url));

export default windowBuild({
    entries: {
        documents: here("./src/documents.js"),
        "document-page": here("./src/document-page.js"),
        "document-body": here("./src/document-body.js"),
    },
    outDir: here("./dist"),
});
