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
const STATED_SHARE_EACH_TYPE = 0.97;
const STATED_SHARE_HELD_OUT = 0.97;

const isShownAsCode = (sample) => render(sample.text).includes('class="chat-code"');
const isRight = (sample) => isShownAsCode(sample) === (sample.type === "code");
const share = (samples) => samples.filter(isRight).length / samples.length;
const ofType = (type) => corpus.samples.filter((sample) => sample.type === type);

test("the corpus holds about a thousand code samples with prose samples beside them, from repos under permissive licences", () => {
    expect(ofType("code").length).toBeGreaterThanOrEqual(1000);
    expect(ofType("prose").length).toBeGreaterThanOrEqual(500);
    expect(corpus.repos.filter((repo) => !PERMISSIVE_LICENCES.includes(repo.license))).toEqual([]);
});

test("the formatter is right about code or prose in the stated share of all samples", () => {
    expect(share(corpus.samples)).toBeGreaterThanOrEqual(STATED_SHARE_OVERALL);
});

test("code written without a fence is shown as code in the stated share of the code samples", () => {
    expect(share(ofType("code"))).toBeGreaterThanOrEqual(STATED_SHARE_EACH_TYPE);
});

test("prose and lists stay text in the stated share of the prose samples", () => {
    expect(share(ofType("prose"))).toBeGreaterThanOrEqual(STATED_SHARE_EACH_TYPE);
});

test("the repos the detection was not calibrated on are held to the stated share too", () => {
    expect(share(corpus.samples.filter((sample) => sample.split === "held out"))).toBeGreaterThanOrEqual(STATED_SHARE_HELD_OUT);
});

test("code with blank lines inside it stays one block", () => {
    const element = document.createElement("div");
    element.innerHTML = render("import os\n\nfrom sys import path\n\nprint(path)");

    expect(element.querySelectorAll("pre.chat-code")).toHaveLength(1);
});

test("paragraphs that open in bold and hold inline code stay text", () => {
    const element = document.createElement("div");
    element.innerHTML = render("I would do both, split by risk.\n\n**Attach it ourselves where it changes nothing but timing.** Set `PYTHONUNBUFFERED=1` in the environment of every run. No flags change and the output stays the same, it just arrives as it happens. That covers Python, which is the most common case, and agents never have to think about it.\n\n**Nudge for flags, never force them.** `--reporter=verbose` or removing `-q` changes what the tool prints, so the reader, and any pipe the agent wrote, may then see a different format. Rewriting flags behind the agent is the same type of hidden change we have just been removing from the pipes. So it stays advice, once per run, naming the exact flag for that tool. A project that wants it permanently can put the flag in an alias.\n\nUnless you prefer otherwise, I will build task 6351 this way.");
    expect(element.querySelector("pre")).toBeNull();
    expect([...element.querySelectorAll("strong")].map((bold) => bold.textContent)).toEqual(["Attach it ourselves where it changes nothing but timing.", "Nudge for flags, never force them."]);
});

const SECTIONS = "### 2.5 How guards use events\n\nA guard declares `event` as a string and has `check(self, change: Change[Model])` (module.py:12).\n\n## 3. The count\n\n### 3.1 Classes\n\n| Name | Count |\n|---|---|\n| a | 1 |";

test("headings and a sentence holding a call in backticks stay text in a message", () => {
    const element = document.createElement("div");
    element.innerHTML = render(SECTIONS);

    expect(element.querySelector("pre")).toBeNull();
    expect(element.querySelectorAll("h5, h4").length).toBe(3);
});

test("a document draws code from a fence and guesses nothing", () => {
    const element = document.createElement("div");
    element.innerHTML = render(`${SECTIONS}\n\ndef unfenced():\n    return 1\n\n\`\`\`python\nvalue = 1\n\`\`\``, {env: "", rowNames: false, document: true});

    expect(element.querySelectorAll("pre").length).toBe(1);
    expect(element.querySelector("[data-language]").dataset.language).toBe("python");
    expect(element.querySelector("pre").textContent).toContain("value = 1");
    expect(element.textContent).toContain("def unfenced():");
});

test("a document draws the adjacent js and vue fences in section 10 separately", () => {
    const element = document.createElement("div");
    const text = readFileSync(resolve(__dirname, "corpus/doc1223-section10.md"), "utf8");
    element.innerHTML = render(text, {env: "", rowNames: false, document: true});
    const blocks = [...element.querySelectorAll(".chat-code-block")];
    expect(blocks.map((block) => block.dataset.language)).toEqual(["js", "vue"]);
    expect(blocks[1].querySelector("code").textContent).toContain("<script setup>");
});

const drawn = (text) => {
    const element = document.createElement("div");
    element.innerHTML = render(text, {env: "", rowNames: false, document: true});
    return element;
};

test("a fence keeps its language when words follow it, and a longer fence holds a shorter one", () => {
    const element = drawn("````c++ the sample\n```\nint value;\n```\n````\n\nAfter.");

    expect(element.querySelectorAll("pre").length).toBe(1);
    expect(element.querySelector("[data-language]").dataset.language).toBe("c++");
    expect(element.querySelector("pre").textContent).toContain("```");
    expect(element.textContent).toContain("After.");
});

test("a fence inside a list loses its indent and the list counts on after it", () => {
    const element = drawn("1. First\n\n   ```sh\n   git status\n   ```\n\n2. Second");

    expect(element.querySelector("pre").textContent.trim()).toBe("git status");
    expect(element.querySelector("ol[start='2'] li").textContent).toBe("Second");
});

test("an indented item is a list inside the item above it", () => {
    const element = drawn("- One\n  - Inner\n  - Inner two\n- Two\n\n1. Step\n   - Part\n2. Next");

    expect([...element.querySelectorAll("ul > li > ul > li")].map((item) => item.textContent)).toEqual(["Inner", "Inner two"]);
    expect(element.querySelectorAll("body > ul > li, div > ul > li").length).toBe(2);
    expect(element.querySelector("ol > li > ul > li").textContent).toBe("Part");
    expect(element.querySelectorAll("ol > li").length).toBe(2);
});

test("text between two pairs of tildes is struck through", () => {
    expect(drawn("It was ~~wrong~~ right.").querySelector("del").textContent).toBe("wrong");
});

test("a sentence with a command in backticks stays a sentence", () => {
    const element = document.createElement("div");
    element.innerHTML = render("Run `git status` first and then fix what it lists.\nAfter that commit the fix.");

    expect(element.querySelector("pre")).toBeNull();
    expect(element.querySelector("code").textContent).toBe("git status");
});
