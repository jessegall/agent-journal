import {fileURLToPath} from "node:url";
import {windowBuild} from "../../kit/build.js";

export default windowBuild({entries: {board: fileURLToPath(new URL("./src/board.js", import.meta.url))}, outDir: fileURLToPath(new URL("./web/dist", import.meta.url))});
