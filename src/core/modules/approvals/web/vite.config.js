import { fileURLToPath } from "node:url";
import { windowBuild } from "../../../../viewer/kit/build.js";

const here = (path) => fileURLToPath(new URL(path, import.meta.url));

export default windowBuild({
  entries: { "approval-dock": here("./src/approval-dock.js"), "standing-used-dock": here("./src/standing-used-dock.js"), "standing-approvals": here("./src/standing-approvals.js") },
  outDir: here("./dist"),
});
