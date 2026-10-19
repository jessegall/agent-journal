import {existsSync, rmSync, writeFileSync} from "node:fs";
import {resolve} from "node:path";

// The mark a test run leaves in the journal's runtime, named by its process, so the journal does not judge requests slow while it runs.
const RUNTIME = resolve(import.meta.dirname, "../../../.journal/runtime");
const MARK = resolve(RUNTIME, `tests.running.${process.pid}`);

export default function setup() {
    if (!existsSync(RUNTIME)) return () => {};
    writeFileSync(MARK, "");
    return () => rmSync(MARK, {force: true});
}
