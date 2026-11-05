import {existsSync, readFileSync, readdirSync} from "node:fs";
import {join, resolve} from "node:path";
import {expect, test} from "vitest";

const MODULE_FOLDERS = ["core", "suites", "tunnels"].map((folder) => resolve(__dirname, "../..", folder));
const SKIPPED = new Set(["node_modules", "__pycache__", "src"]);
const HASHED_CHUNK = /-[A-Za-z0-9_-]{8}\.m?js$/;
const IMPORTED_FILE = /["'`]\.\/([^"'`]+\.m?js)["'`]/g;

function moduleDists(folder) {
    const dist = join(folder, "web", "dist");
    const found = existsSync(join(folder, "web", "vite.config.js")) && existsSync(dist) ? [dist] : [];
    for (const entry of readdirSync(folder, {withFileTypes: true})) {
        if (entry.isDirectory() && !SKIPPED.has(entry.name)) found.push(...moduleDists(join(folder, entry.name)));
    }
    return found;
}

test.each(MODULE_FOLDERS.flatMap(moduleDists))("every hashed chunk in %s is imported by a file beside it", (dist) => {
    const files = readdirSync(dist).filter((name) => /\.m?js$/.test(name));
    const imported = new Set(files.flatMap((name) => [...readFileSync(join(dist, name), "utf8").matchAll(IMPORTED_FILE)].map((match) => match[1])));
    expect(files.filter((name) => HASHED_CHUNK.test(name) && !imported.has(name))).toEqual([]);
});
