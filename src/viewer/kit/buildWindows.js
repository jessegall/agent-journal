import {existsSync, readdirSync} from "node:fs";
import {join} from "node:path";
import {fileURLToPath} from "node:url";
import {build} from "vite";

const MODULE_FOLDERS = [fileURLToPath(new URL("../../core", import.meta.url)), fileURLToPath(new URL("../../suites", import.meta.url))];
const SKIPPED = new Set(["node_modules", "dist", "__pycache__"]);

// every module's window build in the core and the suites, each a web/vite.config.js written with windowBuild
function windowConfigs(folder) {
    const config = join(folder, "web", "vite.config.js");
    const found = existsSync(config) ? [config] : [];
    for (const entry of readdirSync(folder, {withFileTypes: true})) {
        if (entry.isDirectory() && !SKIPPED.has(entry.name)) found.push(...windowConfigs(join(folder, entry.name)));
    }
    return found;
}

for (const config of MODULE_FOLDERS.flatMap(windowConfigs)) await build({configFile: config, logLevel: "warn"});
