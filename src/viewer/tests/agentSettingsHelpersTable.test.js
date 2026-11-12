import {expect, test} from "vitest";
import {mountAgentSettings as mount} from "./support/agentSettingsWindow.js";
import {settle as settled} from "./support/windowContext.js";

const helpers = async (options) => {
    const shell = await mount(options);
    shell.element.querySelector("[data-tab=agents]").click();
    await settled();
    return shell;
};
const row = (element, key) => element.querySelector(`[data-type-row="${key}"]`);

test("the rows are the worker, the merger and the designer, then the line of the read-only helpers and a row for each profile", async () => {
    const {element} = await helpers();
    const keys = [...element.querySelectorAll("[data-type-row], [data-type-group]")].map((entry) => entry.dataset.typeRow ?? entry.dataset.typeGroup);
    expect(keys).toEqual(["worker", "helper:journal-merger", "helper:journal-designer", "helper", "helper:journal-researcher"]);
});

test("a row shows its name, what it does and its counts against its limits", async () => {
    const {element} = await helpers();
    expect(row(element, "worker").querySelector(".name").textContent).toBe("Worker");
    expect(row(element, "worker").querySelector(".line").textContent).toBe("Writes the code of a task.");
    expect([...row(element, "worker").querySelectorAll(".words")].map((words) => words.textContent.replace(/\s+/g, " ").trim())).toEqual(["1 of 1 full", "3 of 3 full"]);
    expect([...row(element, "helper:journal-researcher").querySelectorAll(".words")].map((words) => words.textContent.trim())).toEqual(["1 of 4", "2 of 8"]);
});

test("a type at a limit is amber and says full, and a type with no kept limit shows its count alone", async () => {
    const {element} = await helpers();
    expect(row(element, "worker").querySelectorAll("[data-usage-full]")).toHaveLength(2);
    expect(row(element, "helper:journal-researcher").querySelector("[data-usage-full]")).toBeNull();
    expect(row(element, "helper:journal-merger").querySelectorAll(".words")[1].textContent.trim()).toBe("1");
});

test("the Helpers tab says how many types are at a limit", async () => {
    const {element} = await mount();
    expect(element.querySelector("[data-tab=agents] [data-tab-count]").textContent).toBe("1 full");
});

test("the context cap column says the value and where it comes from", async () => {
    const {element} = await helpers();
    const cap = (key) => [...row(element, key).querySelectorAll(".cap > span, .cap small")].map((part) => part.textContent);
    expect(cap("worker")).toEqual(["200k", "Set for its kind"]);
    expect(cap("helper:journal-researcher")).toEqual(["150k", "Own value"]);
    expect(cap("helper:journal-designer")).toEqual(["400k", "Set for every agent"]);
});

test("the line of the read-only helpers carries the limits every profile shares and a way to change them", async () => {
    const {element} = await helpers();
    const group = element.querySelector("[data-type-group=helper]");
    expect(group.textContent).toContain("Read-only helpers");
    expect(group.textContent).toContain("Every profile runs up to 4 and keeps up to 8");
    expect(group.querySelector("[data-type-open]").textContent).toBe("Change for every profile");
});

test("there is no edit button", async () => {
    const {element} = await helpers();
    expect(element.querySelector("[data-agent-limits-edit]")).toBeNull();
    expect(element.querySelector("[data-agent-settings-agents]").textContent).not.toContain("Edit");
});

test("pressing a row opens its type screen over the table", async () => {
    const {element} = await helpers();
    row(element, "worker").click();
    await settled();
    expect(element.querySelector("[data-agent-type-screen]")).not.toBeNull();
    expect(element.querySelector("[data-type-row]")).toBeNull();
});

test("counts that could not be read show a banner whose Try again reads them again", async () => {
    const {element, reads} = await helpers({unreadable: true});
    expect(element.querySelector("[data-banner=unreadable]").textContent).toContain("The counts could not be read.");
    expect(element.querySelector("[data-type-row]")).toBeNull();
    const before = reads.filter((line) => line.startsWith("agent limits")).length;
    element.querySelector("[data-banner-retry]").click();
    await settled();
    expect(reads.filter((line) => line.startsWith("agent limits")).length).toBe(before + 1);
    expect(row(element, "worker")).not.toBeNull();
});
