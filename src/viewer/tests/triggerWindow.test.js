import {afterEach, expect, test} from "vitest";
import {context, mounted, page, settle, typeInto as typed} from "./support/windowContext.js";
import TriggerCards from "../../core/modules/triggers/web/src/TriggerCards.vue";
import {sentence} from "../../core/modules/triggers/web/src/triggerWords.js";

afterEach(() => (document.body.innerHTML = ""));

const TRIGGER = {id: 1, action: "nudge", text: "Run the release sequence", phrases: ["deploy", "release"], next_at: null, created_at: "2026-11-01T10:00:00Z"};

async function drawn(rows = [TRIGGER]) {
    const ran = [];
    const window = context({"trigger list": page(rows)});
    window.run = async (line) => (ran.push(line), {ok: true, value: {id: 9}});
    return {element: await mounted(TriggerCards, window), ran};
}


const panel = () => document.body.querySelector(".dialog-panel");

test("a sentence says what a trigger does in plain words", () => {
    expect(sentence(TRIGGER)).toBe("When “deploy” or “release” appears, remind the agent “Run the release sequence”.");
    expect(sentence({...TRIGGER, kind: "time", time: "every", every: "30"})).toBe("Every 30 minutes, remind the agent “Run the release sequence”.");
    expect(sentence({...TRIGGER, phrases: []})).toBe("Add the words to watch for and choose what happens.");
});

test("a new trigger needs a name, words and text, starts from an example and is made with its details", async () => {
    const {element, ran} = await drawn();
    element.querySelector("[data-trigger-new]").click();
    await settle();
    expect(panel().querySelector("[data-trigger-save]").disabled).toBe(true);
    expect(panel().textContent).toContain("Give it a name.");
    [...panel().querySelectorAll("button")].find((button) => button.textContent.includes("Block a command")).click();
    await settle();
    typed(panel().querySelector("[data-trigger-description]"), "Blocks it");
    await settle();
    panel().querySelector("[data-trigger-save]").click();
    await settle();
    expect(ran).toContainEqual(["trigger", "make", "push --force", "Never force-push. Ask me first.", "--do", "deny"]);
    expect(ran.at(-1)).toEqual(expect.arrayContaining(["--name", "Block a command", "--description", "Blocks it", "--match-mode", "part"]));
});

test("a trigger is a slip with only its name and line, and a time trigger asks how often", async () => {
    const {element, ran} = await drawn([{...TRIGGER, name: "Release checks", description: "Runs the checks"}]);
    expect(element.querySelector('[data-row="1"]').textContent).toContain("Release checks");
    expect(element.querySelector('[data-row="1"]').textContent).toContain("Runs the checks");
    expect(element.querySelector('[data-row="1"]').textContent).not.toContain("deploy");
    element.querySelector("[data-trigger-new]").click();
    await settle();
    panel().querySelector('[data-trigger-kind="time"]').click();
    await settle();
    typed(panel().querySelector("[data-trigger-name]"), "Check the build");
    typed(panel().querySelector("[data-trigger-text]"), "Check the build");
    await settle();
    expect(panel().querySelector("[data-trigger-save]").disabled).toBe(true);
    typed(panel().querySelector("[data-trigger-every]"), "30");
    await settle();
    panel().querySelector("[data-trigger-save]").click();
    await settle();
    expect(ran).toContainEqual(["trigger", "schedule", "Check the build", "--every", "30"]);
});

test("a new time trigger can come by a cron line, and an agent condition and a web call go in its details", async () => {
    const {element, ran} = await drawn();
    element.querySelector("[data-trigger-new]").click();
    await settle();
    panel().querySelector('[data-trigger-kind="time"]').click();
    await settle();
    panel().querySelector('[data-trigger-time="cron"]').click();
    await settle();
    typed(panel().querySelector("[data-trigger-name]"), "Morning check");
    typed(panel().querySelector("[data-trigger-text]"), "Look at the build");
    typed(panel().querySelector("[data-trigger-cron]"), "0 9 * * 1-5");
    await settle();
    panel().querySelector("[data-trigger-save]").click();
    await settle();
    expect(ran).toContainEqual(["trigger", "schedule", "Look at the build", "--cron", "0 9 * * 1-5"]);
    expect(ran.at(-1).slice(0, 3)).toEqual(["trigger", "edit", "9"]);
});

test("an opened trigger shows its conditions and extra actions and saves them back", async () => {
    const stored = {...TRIGGER, name: "Release checks", conditions: JSON.stringify([{type: "fired", value: "3"}]), extra_actions: JSON.stringify([{type: "web", target: "https://example.com/a"}])};
    const {element, ran} = await drawn([stored]);
    element.querySelector('[data-row="1"]').click();
    await settle();
    const inputs = panel().querySelectorAll("[data-trigger-listed]");
    expect([...inputs].map((input) => input.value)).toEqual(["3", "https://example.com/a"]);
    typed(inputs[0], "5");
    await settle();
    panel().querySelector("[data-trigger-save]").click();
    await settle();
    const line = ran.at(-1);
    expect(JSON.parse(line[line.indexOf("--conditions") + 1])).toEqual([{type: "fired", value: "5"}]);
    expect(JSON.parse(line[line.indexOf("--extra-actions") + 1])).toEqual([{type: "web", target: "https://example.com/a"}]);
});

test("opening a trigger saves its changes together, pauses it, and ends it only after asking", async () => {
    const {element, ran} = await drawn([{...TRIGGER, name: "Release checks"}]);
    element.querySelector('[data-row="1"]').click();
    await settle();
    const word = panel().querySelector("[data-trigger-word]");
    typed(word, "ship");
    word.dispatchEvent(new KeyboardEvent("keydown", {key: "Enter", bubbles: true}));
    await settle();
    expect(ran).toEqual([]);
    panel().querySelector("[data-trigger-save]").click();
    await settle();
    expect(ran.at(-1)).toEqual(expect.arrayContaining(["--phrases", "deploy", "release", "ship"]));
    expect(panel()).toBeNull();
    element.querySelector('[data-row="1"]').click();
    await settle();
    panel().querySelector("[data-trigger-strike]").click();
    await settle();
    expect(ran).not.toContainEqual(["trigger", "strike", "1"]);
    panel().querySelector("[data-trigger-strike-sure]").click();
    await settle();
    expect(ran).toContainEqual(["trigger", "strike", "1"]);
});
