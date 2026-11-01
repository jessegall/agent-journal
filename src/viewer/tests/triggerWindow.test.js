import {afterEach, expect, test} from "vitest";
import {context, mounted, page, settle, typeInto as typed} from "./support/windowContext.js";
import TriggerCards from "../../core/modules/triggers/web/src/TriggerCards.vue";
import {sentence} from "../../core/modules/triggers/web/src/triggerWords.js";

afterEach(() => (document.body.innerHTML = ""));

const TRIGGER = {id: 1, action: "nudge", text: "Run the release sequence", phrases: ["deploy", "release"], next_at: null, created_at: "2026-11-01T10:00:00Z"};

async function drawn(rows = [TRIGGER]) {
    const ran = [];
    const window = context({"trigger list": page(rows)});
    window.run = async (line) => (ran.push(line), {ok: true, value: {}});
    return {element: await mounted(TriggerCards, window), ran};
}


const panel = () => document.body.querySelector(".dialog-panel");

test("a sentence says what a trigger does in plain words", () => {
    expect(sentence(TRIGGER)).toBe("When “deploy” or “release” comes up, remind the agent “Run the release sequence”.");
    expect(sentence({...TRIGGER, phrases: []})).toBe("Add the words to watch for and choose what happens.");
});

test("a new trigger needs its words and text, starts from an example and is made", async () => {
    const {element, ran} = await drawn();
    element.querySelector("[data-trigger-new]").click();
    await settle();
    expect(panel().querySelector("[data-trigger-create]").disabled).toBe(true);
    expect(panel().textContent).toContain("Add at least one word.");
    [...panel().querySelectorAll("button")].find((button) => button.textContent.includes("Block a command")).click();
    await settle();
    panel().querySelector("[data-trigger-create]").click();
    await settle();
    expect(ran).toContainEqual(["trigger", "make", "push --force", "Never force-push. Ask me first.", "--do", "deny"]);
});

test("a new trigger on a schedule says how often it runs", async () => {
    const {element, ran} = await drawn();
    element.querySelector("[data-trigger-new]").click();
    await settle();
    [...panel().querySelectorAll("button")].find((button) => button.textContent.includes("On a schedule")).click();
    await settle();
    expect(panel().querySelector("[data-action]")).toBeNull();
    const text = panel().querySelector("[data-trigger-text]");
    text.value = "Check the build";
    text.dispatchEvent(new Event("change"));
    await settle();
    expect(panel().querySelector("[data-trigger-create]").disabled).toBe(true);
    typed(panel().querySelector("[data-trigger-every]"), "30");
    await settle();
    panel().querySelector("[data-trigger-create]").click();
    await settle();
    expect(ran).toContainEqual(["trigger", "schedule", "Check the build", "--every", "30"]);
});

test("opening a trigger changes its words and action, and ends it", async () => {
    const {element, ran} = await drawn();
    element.querySelector('[data-row="1"]').click();
    await settle();
    const word = panel().querySelector("[data-trigger-word]");
    typed(word, "ship");
    word.dispatchEvent(new KeyboardEvent("keydown", {key: "Enter", bubbles: true}));
    await settle();
    expect(ran).toContainEqual(["trigger", "edit", "1", "--phrases", "deploy", "release", "ship"]);
    panel().querySelector('[data-action="deny"]').click();
    await settle();
    expect(ran).toContainEqual(["trigger", "edit", "1", "--action", "deny"]);
    panel().querySelector("[data-trigger-strike]").click();
    await settle();
    expect(ran).toContainEqual(["trigger", "strike", "1"]);
    expect(panel()).toBeNull();
});

test("a scheduled trigger only has its text changed", async () => {
    const {element} = await drawn([{...TRIGGER, next_at: "2036-01-01T00:00:00Z", phrases: []}]);
    element.querySelector('[data-row="1"]').click();
    await settle();
    expect(panel().querySelector("[data-trigger-word]")).toBeNull();
    expect(panel().querySelector("[data-trigger-text]").value).toBe("Run the release sequence");
});
