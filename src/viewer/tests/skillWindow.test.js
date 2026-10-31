import {createApp, h, nextTick} from "vue";
import {expect, test} from "vitest";
import {WINDOW_CONTEXT} from "@journal/window-kit";
import {context, page} from "./support/windowContext.js";
import Skills from "../../core/modules/skills/web/src/skills.js";

const LOADED = page([{id: 2, agent_id: 7, skill: "journal-tasks", state: "loaded"}, {id: 1, agent_id: 7, skill: "journal-notes", state: "loaded"}]);
const CATALOGUE = page([{folder: "journal-notes", description: "How to take notes"}, {folder: "journal-tasks", description: "How to work a task"}, {folder: "journal", description: "The journal"}]);
const TEXT = {ok: true, value: {folder: "journal-notes", description: "How to take notes", text: "Write a note for every decision."}};

async function mounted(answers) {
    const windowContext = context(answers, 7);
    const heard = [];
    windowContext.follow = (patterns, handler) => heard.push({patterns, handler});
    const element = document.createElement("div");
    document.body.appendChild(element);
    createApp({render: () => h(Skills)}).provide(WINDOW_CONTEXT, windowContext).mount(element);
    await settled();
    return {element, windowContext, heard};
}

async function settled() {
    for (let round = 0; round < 6; round++) await nextTick();
    await new Promise((resolve) => setTimeout(resolve, 10));
}

test("the loaded skills show newest last, each with a book icon", async () => {
    const {element} = await mounted({"agent-skill list": LOADED});
    const rows = [...element.querySelectorAll(".skill-row")];
    expect(rows.map((row) => row.textContent.trim())).toEqual(["journal-notes", "journal-tasks"]);
    expect(rows.every((row) => row.querySelector("svg.skill-book"))).toBe(true);
});

test("an agent that has loaded no skill is told so", async () => {
    const {element} = await mounted({"agent-skill list": page([])});
    expect(element.textContent).toContain("No skill is loaded in this conversation.");
});

test("Browse every skill switches to the catalogue with each skill's description", async () => {
    const {element} = await mounted({"agent-skill list": LOADED, "skill list": CATALOGUE});
    [...element.querySelectorAll("button")].find((button) => button.textContent.includes("Browse every skill")).click();
    await settled();
    expect(element.textContent).toContain("How to take notes");
    expect(element.textContent).toContain("The journal");
});

test("a click on a skill opens its text in the window", async () => {
    const {element, windowContext} = await mounted({"agent-skill list": LOADED, "skill show": TEXT});
    element.querySelector(".skill-row").click();
    await settled();
    expect(windowContext.reads).toContain("skill show journal-notes");
    expect(element.textContent).toContain("Write a note for every decision.");
});

test("a compaction, which removes the loaded rows, empties the list", async () => {
    const answers = {"agent-skill list": LOADED};
    const {element, heard} = await mounted(answers);
    expect(element.querySelectorAll(".skill-row").length).toBe(2);
    answers["agent-skill list"] = page([]);
    heard.find((follow) => follow.patterns.includes("agent_skill.*")).handler({event: "agent_skill.delete"});
    await settled();
    expect(element.textContent).toContain("No skill is loaded in this conversation.");
});
