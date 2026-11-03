import {readFileSync} from "node:fs";
import {resolve} from "node:path";
import {gunzipSync} from "node:zlib";
import {expect, test} from "vitest";
import {render} from "../src/text/index.js";
import "../src/text/all.js";

// the corpus, its sources and its licences are described in corpus/NOTICE.md, with the share right before and after the calibration
const corpus = JSON.parse(gunzipSync(readFileSync(resolve(__dirname, "corpus/code_and_prose.json.gz"))));

const PERMISSIVE_LICENCES = ["MIT", "Apache-2.0", "BSD-2-Clause", "BSD-3-Clause", "Unlicense", "curl"];
const STATED_SHARE_OVERALL = 0.98;
const STATED_SHARE_EACH_KIND = 0.97;
const STATED_SHARE_HELD_OUT = 0.97;

const isShownAsCode = (sample) => render(sample.text).includes('class="chat-code"');
const isRight = (sample) => isShownAsCode(sample) === (sample.kind === "code");
const share = (samples) => samples.filter(isRight).length / samples.length;
const ofKind = (kind) => corpus.samples.filter((sample) => sample.kind === kind);

test("the corpus holds about a thousand code samples with prose samples beside them, from repos under permissive licences", () => {
    expect(ofKind("code").length).toBeGreaterThanOrEqual(1000);
    expect(ofKind("prose").length).toBeGreaterThanOrEqual(500);
    expect(corpus.repos.filter((repo) => !PERMISSIVE_LICENCES.includes(repo.license))).toEqual([]);
});

test("the formatter is right about code or prose in the stated share of all samples", () => {
    expect(share(corpus.samples)).toBeGreaterThanOrEqual(STATED_SHARE_OVERALL);
});

test("code written without a fence is shown as code in the stated share of the code samples", () => {
    expect(share(ofKind("code"))).toBeGreaterThanOrEqual(STATED_SHARE_EACH_KIND);
});

test("prose and lists stay text in the stated share of the prose samples", () => {
    expect(share(ofKind("prose"))).toBeGreaterThanOrEqual(STATED_SHARE_EACH_KIND);
});

test("the repos the detection was not calibrated on are held to the stated share too", () => {
    expect(share(corpus.samples.filter((sample) => sample.split === "held out"))).toBeGreaterThanOrEqual(STATED_SHARE_HELD_OUT);
});

test("code with blank lines inside it stays one block", () => {
    const element = document.createElement("div");
    element.innerHTML = render("import os\n\nfrom sys import path\n\nprint(path)");

    expect(element.querySelectorAll("pre.chat-code")).toHaveLength(1);
});

test("a sentence with a command in backticks stays a sentence", () => {
    const element = document.createElement("div");
    element.innerHTML = render("Run `git status` first and then fix what it lists.\nAfter that commit the fix.");

    expect(element.querySelector("pre")).toBeNull();
    expect(element.querySelector("code").textContent).toBe("git status");
});
