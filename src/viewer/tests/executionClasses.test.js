import {createApp, h} from "vue";
import {afterEach, expect, test, vi} from "vitest";
import ExecutionClasses from "../src/resource/ExecutionClasses.vue";

const TABLE = {
    classes: [
        {name: "test, build or check", lane: "long", cost: 4, priority: "agent", limit: 0, pattern: "", plugin: "", origin: "built-in"},
        {name: "merge", lane: "long", cost: 2, priority: "agent", limit: 1, pattern: "", plugin: "", origin: "changed"},
        {name: "e2e", lane: "long", cost: 8, priority: "normal", limit: 1, pattern: "^npm run e2e", plugin: "", origin: "your own"},
    ],
    settings: [{key: "journal.core.processes.lane-capacity-long", title: "Long lane capacity", description: "Slot units of long runs.", value: 8}],
};
let app = null;
const settle = () => new Promise((resolve) => setTimeout(resolve, 20));

afterEach(() => {
    app?.unmount();
    document.body.innerHTML = "";
});

async function mounted(read) {
    const element = document.createElement("div");
    document.body.append(element);
    app = createApp({render: () => h(ExecutionClasses, {read})});
    app.mount(element);
    await settle();
}

function typed(selector, value) {
    const input = document.body.querySelector(selector);
    input.value = value;
    input.dispatchEvent(new Event("input"));
    input.dispatchEvent(new Event("change"));
}

test("the class table renders its rows with where each comes from", async () => {
    await mounted(async () => ({ok: true, value: TABLE}));
    const rows = [...document.body.querySelectorAll("[data-class-row]")];
    expect(rows.map((row) => row.dataset.classRow)).toEqual(["test, build or check", "merge", "e2e"]);
    expect(rows[1].textContent).toContain("Changed");
    expect(rows[2].textContent).toContain("^npm run e2e");
    expect(rows[1].querySelector("[data-class-reset]")).not.toBeNull();
    expect(rows[2].querySelector("[data-class-remove]")).not.toBeNull();
    expect(document.body.querySelector('[data-lane-setting="journal.core.processes.lane-capacity-long"]').value).toBe("8");
});

test("an edited row sends the set line and reads the table again", async () => {
    const read = vi.fn(async () => ({ok: true, value: TABLE}));
    await mounted(read);
    document.body.querySelector('[data-class-row="merge"] [data-class-edit]').click();
    await settle();
    typed('[data-class-row="merge"] [data-class-cost]', "3");
    document.body.querySelector('[data-class-row="merge"] [data-class-save]').click();
    await settle();
    expect(read).toHaveBeenCalledWith(["queue-class", "set", "merge", "--lane", "long", "--cost", "3", "--priority", "agent", "--limit", "1"]);
    expect(read.mock.calls.filter(([line]) => line.join(" ") === "queue-class list")).toHaveLength(2);
});

test("a new class shows the matching lines before it can be added", async () => {
    const read = vi.fn(async (line) => (line[1] === "preview" ? {ok: true, value: {lines: ["npm run e2e -- --headed"]}} : {ok: true, value: TABLE}));
    await mounted(read);
    typed("[data-class-name]", "browser tests");
    typed("[data-class-pattern]", "^npm run e2e");
    await settle();
    expect(document.body.querySelector("[data-class-add]").disabled).toBe(true);
    document.body.querySelector("[data-class-preview]").click();
    await settle();
    expect(read).toHaveBeenCalledWith(["queue-class", "preview", "--pattern", "^npm run e2e"]);
    expect(document.body.querySelector("[data-class-preview-lines]").textContent).toContain("npm run e2e -- --headed");
    expect(document.body.querySelector("[data-class-add]").disabled).toBe(false);
    document.body.querySelector("[data-class-add]").click();
    await settle();
    expect(read).toHaveBeenCalledWith(["queue-class", "add", "browser tests", "--pattern", "^npm run e2e", "--lane", "long", "--cost", "1", "--priority", "normal", "--limit", "0"]);
});

test("a refused save shows the text of the refusal", async () => {
    await mounted(async (line) => (line[1] === "list" ? {ok: true, value: TABLE} : {ok: false, error: "there is no lane fast: name one of instant, short, long"}));
    document.body.querySelector('[data-class-preset="small"]').click();
    await settle();
    expect(document.body.querySelector("[data-class-failure]").textContent).toBe("there is no lane fast: name one of instant, short, long");
});
