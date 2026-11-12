import {expect, test} from "vitest";
import {AGENTS, PROFILE_LIMITS, READ_ONLY_KEPT, READ_ONLY_RUN, WORKER_KEPT, WORKER_RUN, mountAgentSettings as mount} from "./support/agentSettingsWindow.js";
import {settle as settled} from "./support/windowContext.js";

const open = async (key, options) => {
    const shell = await mount(options);
    shell.element.querySelector("[data-tab=agents]").click();
    await settled();
    shell.element.querySelector(`[data-type-row="${key}"], [data-type-open="${key}"]`).click();
    await settled();
    await settled();
    return shell;
};
const setting = (element, key) => element.querySelector(`[data-setting="${key}"]`);
const type = async (field, text) => { field.value = text; field.dispatchEvent(new Event("input")); await settled(); };
const note = (element) => element.querySelector("[data-settings-note]").textContent;

test("opening the workers shows their settings on the left and their agents on the right with the running one first", async () => {
    const {element} = await open("worker");
    expect(element.querySelector("[data-agent-type-screen] [data-back]").textContent).toBe("Helpers");
    expect(element.querySelector("[data-agent-type-screen] b").textContent).toBe("Worker");
    expect(setting(element, WORKER_RUN).querySelector("input").value).toBe("1");
    expect(setting(element, WORKER_KEPT).querySelector("input").value).toBe("3");
    expect([...element.querySelectorAll("[data-count-agent]")].map((agent) => agent.dataset.countAgent)).toEqual(["43", "42"]);
});

test("Retire is offered for an idle agent only", async () => {
    const {element} = await open("worker");
    const retire = (id) => [...element.querySelector(`[data-count-agent="${id}"]`).querySelectorAll("button")].some((button) => button.textContent === "Retire");
    expect(retire(42)).toBe(true);
    expect(retire(43)).toBe(false);
});

test("a type with no agent says so", async () => {
    const {element} = await open("worker", {agents: []});
    expect(element.querySelector("[data-type-agents]").textContent).toContain("No agents here yet");
});

test("a change on a type screen is in the foot of the modal and saves with the other changes", async () => {
    const {element, runs} = await open("worker");
    await type(setting(element, WORKER_RUN).querySelector("input"), "2");
    expect(note(element)).toBe("1 change: Workers running: 2");
    element.querySelector("[data-settings-apply]").click();
    await settled();
    expect(runs).toEqual([["setting-screen", "apply", "helper-type.workers", "--revision", "hw1", `${WORKER_RUN}=2`]]);
});

test("Back returns to the table and the draft is kept", async () => {
    const {element} = await open("worker");
    await type(setting(element, WORKER_RUN).querySelector("input"), "2");
    element.querySelector("[data-back]").click();
    await settled();
    expect(element.querySelector("[data-type-row=worker]")).not.toBeNull();
    expect(note(element)).toBe("1 change: Workers running: 2");
    element.querySelector("[data-type-row=worker]").click();
    await settled();
    expect(setting(element, WORKER_RUN).querySelector("input").value).toBe("2");
});

test("the line of the read-only helpers shows the limits every profile shares", async () => {
    const {element} = await open("helper");
    expect(setting(element, READ_ONLY_RUN).querySelector("input").value).toBe("4");
    expect(setting(element, READ_ONLY_KEPT).querySelector("input").value).toBe("8");
});

test("a profile shows the limit of every profile, and an edit makes it the profile's own and leaves the limit of every profile", async () => {
    const {element, runs} = await open("helper:journal-designer");
    const running = () => element.querySelector("[data-override-running]");
    expect(running().querySelector("input").value).toBe("4");
    expect(running().querySelector("[data-setting-source]").textContent).toBe("Every profile");
    await type(running().querySelector("input"), "2");
    expect(running().querySelector("[data-setting-source]").textContent).toBe("Own value");
    expect(element.querySelector("[data-override-kept] [data-setting-source]").textContent).toBe("Own value");
    element.querySelector("[data-settings-apply]").click();
    await settled();
    expect(runs).toHaveLength(1);
    expect(runs[0]).toContain(`${PROFILE_LIMITS}=["journal-researcher:2:5","journal-designer:2:8"]`);
    expect(runs[0].join(" ")).not.toContain(READ_ONLY_RUN);
});

test("going back to every profile gives the own limits up", async () => {
    const {element} = await open("helper:journal-researcher");
    const running = () => element.querySelector("[data-override-running]");
    expect(running().querySelector("input").value).toBe("2");
    expect(running().querySelector("[data-setting-source]").textContent).toBe("Own value");
    running().querySelector("[data-back-to-every-profile]").click();
    await settled();
    expect(running().querySelector("input").value).toBe("4");
    expect(running().querySelector("[data-setting-source]").textContent).toBe("Every profile");
});

test("a viewer who may only read sees the settings with their controls off", async () => {
    const {element} = await open("worker", {readOnly: true});
    expect(setting(element, WORKER_RUN).querySelector("input").disabled).toBe(true);
    expect(element.querySelector("[data-settings-apply]")).toBeNull();
    expect(AGENTS().length).toBeGreaterThan(0);
});
