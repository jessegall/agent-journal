import { fileURLToPath } from "node:url";
import { windowBuild } from "../../../../viewer/kit/build.js";

const here = (path) => fileURLToPath(new URL(path, import.meta.url));

export default windowBuild({
  entries: { "approval-dock": here("./src/approval-dock.js"), "saved-used-dock": here("./src/saved-used-dock.js"), "saved-approvals": here("./src/saved-approvals.js") },
  outDir: here("./dist"),
});
