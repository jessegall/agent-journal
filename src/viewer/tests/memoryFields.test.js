import {readFileSync, readdirSync} from "node:fs";
import {resolve} from "node:path";
import {expect, test} from "vitest";
import {createApp, h} from "vue";
import {settled} from "./settled.js";
import MemoryFacts from "../src/resource/MemoryFacts.vue";

const MODULE_SOURCE = resolve(__dirname, "../../core/modules/memories/web/src");
const PLAIN_FIELD = /<(input|textarea|select)\b/;

test("the keyword field of a memory's panel is the kit's text input", async () => {
    const element = document.createElement("div");
    createApp(() => h(MemoryFacts, {id: 3, read: async () => ({ok: true, value: {rows: []}})})).mount(element);
    await settled();
    const fields = element.querySelectorAll("input, textarea, select");
    expect(fields).toHaveLength(1);
    expect(fields[0].classList.contains("text-input")).toBe(true);
});

test("no memory window or panel file draws a plain input, textarea or select", () => {
    const files = readdirSync(MODULE_SOURCE).filter((name) => name.endsWith(".vue")).map((name) => resolve(MODULE_SOURCE, name));
    files.push(resolve(__dirname, "../src/resource/MemoryFacts.vue"));
    for (const file of files) expect(readFileSync(file, "utf8"), file).not.toMatch(PLAIN_FIELD);
});
