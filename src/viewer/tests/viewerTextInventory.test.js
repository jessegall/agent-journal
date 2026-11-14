import {mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync} from "node:fs";
import {tmpdir} from "node:os";
import {dirname, resolve} from "node:path";
import {afterEach, expect, test} from "vitest";
import {inventory} from "../../../tools/viewer-text.mjs";

let folder;
afterEach(() => {
    if (folder) rmSync(folder, {recursive: true, force: true});
});

function sample(file, source) {
    const path = resolve(folder, file);
    mkdirSync(dirname(path), {recursive: true});
    writeFileSync(path, source);
}

test("the inventory includes templates, bound text, scripts and backend declarations with source lines", () => {
    folder = mkdtempSync(resolve(tmpdir(), "viewer-text-"));
    sample("src/module/web/src/Example.vue", `<script setup>
const options = [{title: "Account", line: "Choose an account"}];
</script>
<template>
<button title="Open account">Open <b>account</b></button>
<input :placeholder="saved ? 'Keep saved credential' : 'Add credential'" aria-label="Credential">
<p>{{ saved ? "Saved" : "Not saved" }}</p>
</template>`);
    sample("src/viewer/src/labels.js", `export const options = {help: "Choose a project", empty: "No projects", tooltip: "Open project"};`);
    sample("src/example.py", `class ExampleModule:
    title = "Accounts"
    windows = [WindowDeclaration("accounts", "Account window", "accounts.js", label="Account label")]
    options = [ChoiceOption("scope", "Scope", [("all", "All accounts")], "all")]
    marks = [MarkDeclaration(TYPE, VARIANT, FAMILY, "Account updates", "account", group_label="Updates: {count}")]
    presets = [LayoutPreset("basic", "Basic layout", "Account and chat", None)]
    settings = [SettingValue("enabled", "Enabled", "Allow account access", TYPE)]
`);
    sample("src/example.json", '{"title":"Account status","options":[{"label":"Paused"}]}');
    sample("src/viewer/tests/Excluded.vue", "<template>Test-only words</template>");
    sample("src/module/web/dist/Excluded.vue", "<template>Built words</template>");
    const records = inventory(folder);
    const texts = records.map((record) => record.text);
    expect(texts).toEqual(expect.arrayContaining(["Open", "account", "Open account", "Keep saved credential", "Add credential", "Credential", "Saved", "Not saved", "Choose an account", "Choose a project", "No projects", "Open project", "Accounts", "Account window", "Account label", "Scope", "All accounts", "Account updates", "Updates: {count}", "Basic layout", "Account and chat", "Enabled", "Allow account access", "Account status", "Paused"]));
    expect(texts).not.toContain("Test-only words");
    expect(texts).not.toContain("Built words");
    expect(texts).not.toContain("accounts.js");
    expect(records).toContainEqual({file: "src/example.py", line: 3, text: "Account window"});
    expect(records).toContainEqual({file: "src/module/web/src/Example.vue", line: 5, text: "Open account"});
});

test("the complete viewer inventory contains none of the rejected wording", () => {
    const root = resolve(import.meta.dirname, "../../..");
    const {bad_viewer_phrases: phrases} = JSON.parse(readFileSync(resolve(root, ".commandments/custom/lists.json"), "utf8"));
    const records = inventory(root);
    expect(records.length).toBeGreaterThan(1000);
    const patterns = phrases.map((phrase) => new RegExp(`\\b${phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i"));
    const rejected = records.filter(({text}) => patterns.some((pattern) => pattern.test(text)));
    expect(rejected).toEqual([]);
});
