import {createApp, h} from "vue";
import {afterEach, beforeEach, expect, test, vi} from "vitest";
import ButtonForm from "../src/kit/ButtonForm.vue";
import {perLine, pickButton, settle} from "./support/windowContext.js";

const ROW = {id: 12, term: "plan", title: "A better journal", state: "started"};
const ASSIGN = {name: "plans.assign-agent", slots: [], label: "Assign to an agent", runs: "plan assign {row_id} --to={agent}", menu: [], icon: "", primary: false, condition: null, tip: "",
    fields: [{name: "agent", label: "Agent", first_role: "main"}]};
const AGENTS = [
    {id: 4, role: "worker", given_name: "Grace Hopper"},
    {id: 9, role: "worker", given_name: ""},
    {id: 7, role: "main", given_name: "Ada Lovelace"},
];
const mounted = [];
let reads, writes;

beforeEach(() => {
    vi.stubGlobal("ResizeObserver", class {
        observe() {}
        unobserve() {}
        disconnect() {}
    });
    reads = [];
    writes = [];
    vi.stubGlobal("fetch", perLine(async (url, init) => {
        const body = JSON.parse(init.body);
        if (body.line[0] === "agent") {
            reads.push(body);
            return {ok: true, json: async () => ({code: 0, value: {rows: AGENTS}, error: ""})};
        }
        writes.push(body);
        return {ok: true, json: async () => ({code: 0, value: {}, error: ""})};
    }));
});

afterEach(() => {
    mounted.splice(0).forEach((app) => app.unmount());
    document.body.innerHTML = "";
    vi.unstubAllGlobals();
});

async function opened() {
    const element = document.createElement("div");
    document.body.append(element);
    const app = createApp({render: () => h(ButtonForm, {button: ASSIGN, row: ROW, environment: "main"})});
    app.directive("tip", {});
    app.mount(element);
    mounted.push(app);
    await settle();
    document.querySelector("[data-drop-head]").click();
    await settle();
    return document.querySelector("[data-button-form]");
}

const items = () => [...document.querySelectorAll("[data-drop-item]")];

test("the agent field lists the running agents with the main agent first", async () => {
    await opened();
    expect(reads[0]).toMatchObject({window: "messages.chat", line: ["agent", "running"], environment: "main"});
    expect(items().map((item) => item.getAttribute("data-drop-item"))).toEqual(["7", "4", "9"]);
    expect(items()[0].textContent).toContain("Ada Lovelace");
    expect(items()[2].textContent).toContain("Worker 9");
});

test("picking an agent sends the plan's assign line with its number", async () => {
    const form = await opened();
    expect(form.querySelector("[data-button-send]").disabled).toBe(true);
    items().find((item) => item.getAttribute("data-drop-item") === "4").click();
    await settle();
    expect(form.querySelector("[data-button-send]").disabled).toBe(false);
    await pickButton(form, "Send");
    expect(writes.at(-1).line).toEqual(["plan", "assign", "12", "--to=4"]);
});
