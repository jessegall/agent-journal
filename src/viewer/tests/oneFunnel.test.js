import {readdirSync, readFileSync, statSync} from "node:fs";
import {join, relative, resolve} from "node:path";
import {expect, test} from "vitest";

const ROOT = resolve(__dirname, "../..");
const SOURCES = ["viewer/src", "viewer/kit", "core/modules", "suites"];
const FUNNEL = "viewer/src/api/transport.js";
const CALL = /\bfetch\(|new EventSource|new WebSocket|XMLHttpRequest|sendBeacon/;
const SKIPPED = new Set(["node_modules", "dist", "tests"]);

function sources(folder) {
    return readdirSync(folder).flatMap((name) => {
        const path = join(folder, name);
        if (SKIPPED.has(name)) return [];
        if (statSync(path).isDirectory()) return sources(path);
        return /\.(js|vue)$/.test(name) ? [path] : [];
    });
}

test("every request of the viewer, and its event stream, goes through the one transport file", () => {
    const files = SOURCES.flatMap((folder) => sources(join(ROOT, folder)));
    const outside = files.map((file) => relative(ROOT, file)).filter((file) => file !== FUNNEL && CALL.test(readFileSync(join(ROOT, file), "utf8")));
    expect(outside).toEqual([]);
});
