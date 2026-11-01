import {afterEach, expect, test} from "vitest";
import {context, mounted, page, settle} from "./support/windowContext.js";
import {h} from "vue";
import AgentRows from "../../core/modules/agents/web/src/AgentRows.vue";
import {age, ago} from "../src/format/time.js";

afterEach(() => (document.body.innerHTML = ""));

const AGENTS = [
    {id: 2, session: "s-live", program: "claude", role: "main", ended_at: null},
    {id: 1, session: "s-old", program: "codex", role: "worker", ended_at: "2026-11-01T10:00:00Z"},
];

const drawn = () => mounted({render: () => h(AgentRows, {line: "agent list", empty: "No agents yet"})}, context({"agent list": page(AGENTS)}));

const pick = async (element, label) => {
    [...element.querySelectorAll("button")].find((button) => button.textContent.trim() === label).click();
    await settle();
};

test("the agents window filters on running or closed", async () => {
    const element = await drawn();
    expect(element.textContent).toContain("s-live");
    expect(element.textContent).toContain("s-old");
    await pick(element, "Running");
    expect(element.textContent).not.toContain("s-old");
    await pick(element, "Closed");
    expect(element.textContent).not.toContain("s-live");
});

test("the agents window searches the session, program and role", async () => {
    const element = await drawn();
    const search = element.querySelector(".agents-search input") || element.querySelector("input");
    search.value = "codex";
    search.dispatchEvent(new Event("input"));
    await settle();
    expect(element.textContent).toContain("s-old");
    expect(element.textContent).not.toContain("s-live");
    search.value = "nobody";
    search.dispatchEvent(new Event("input"));
    await settle();
    expect(element.textContent).toContain("Nothing matches");
});

test("an age reads a row's ISO time as well as epoch seconds", () => {
    const hourAgo = new Date(Date.now() - 3_600_000);
    expect(ago(hourAgo.toISOString())).toBe("1h ago");
    expect(age(hourAgo.getTime() / 1000)).toBe("1h");
});
