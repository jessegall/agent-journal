import {createApp, h} from "vue";
import {afterEach, expect, test} from "vitest";
import InformationBar from "../src/shell/InformationBar.vue";
import {settle} from "./support/windowContext.js";

afterEach(() => (document.body.innerHTML = ""));

globalThis.ResizeObserver ??= class {
    observe() {}
    disconnect() {}
};

const SKILLS = [{id: 1, skill: "journal-tasks", state: "loaded"}, {id: 2, skill: "journal-memory", state: "due"}];

function drawn() {
    const ran = [];
    const opened = [];
    const run = async (line) => {
        ran.push(line.join(" "));
        return line[0] === "agent-skill" ? {ok: true, value: {rows: SKILLS}} : {ok: false, error: "not asked here"};
    };
    const element = document.createElement("div");
    document.body.append(element);
    createApp({render: () => h(InformationBar, {agent: {id: 9, program: "claude", session: "s"}, run, skills: SKILLS, onOpen: (key) => opened.push(key)})}).mount(element);
    return {element, ran, opened};
}

test("the bar counts the skills the agent has read, and its menu shows read and still to read", async () => {
    const {element, ran, opened} = drawn();
    await settle();
    expect(ran).toEqual([]);
    const button = element.querySelector('[data-fact="skills"]');
    expect(button.textContent.trim()).toBe("1");
    button.click();
    await settle();
    expect(document.body.querySelector("[data-agent-skill-read]").textContent).toBe("journal-tasks");
    expect(document.body.querySelector("[data-agent-skill-waiting]").textContent).toBe("journal-memory");
    document.body.querySelector("[data-agent-skills-browse]").click();
    await settle();
    expect(opened).toEqual(["skills"]);
});
