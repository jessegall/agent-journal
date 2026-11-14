import {readFileSync, readdirSync} from "node:fs";
import {resolve} from "node:path";
import {expect, test} from "vitest";

const MODULE_SOURCE = resolve(__dirname, "../../core/modules/memories/web/src");
const PLAIN_FIELD = /<(input|textarea|select)\b/;

test("no memory window or panel file draws a plain input, textarea or select", () => {
    const files = readdirSync(MODULE_SOURCE).filter((name) => name.endsWith(".vue")).map((name) => resolve(MODULE_SOURCE, name));
    for (const file of files) expect(readFileSync(file, "utf8"), file).not.toMatch(PLAIN_FIELD);
});
