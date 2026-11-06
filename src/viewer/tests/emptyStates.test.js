import {readdirSync, readFileSync} from "node:fs";
import {join, resolve} from "node:path";
import {afterEach, expect, test} from "vitest";
import {createApp, h, ref} from "vue";
import {WINDOW_CONTEXT} from "@journal/window-kit";
import {context, mounted, page, pickButton, settle} from "./support/windowContext.js";
import RowList from "../kit/RowList.vue";
import {useListTools} from "../kit/useListTools.js";
import AgentRows from "../../core/modules/agents/web/src/AgentRows.vue";
import {agentFilterOptions} from "./support/agentFilterOptions.js";
import MemoriesPage from "../../core/modules/memories/web/src/MemoriesPage.vue";
import {default as helpers} from "../../core/modules/agents/web/src/helpers.js";

let app;
let host;

afterEach(() => {
    app?.unmount();
    host?.remove();
    document.body.innerHTML = "";
});

function drawn(props, rows = []) {
    host = document.createElement("div");
    document.body.append(host);
    app = createApp({render: () => h(RowList, {rows, loaded: true, ...props})});
    app.mount(host);
    return host;
}

const empty = () => host.querySelector("[data-row-list-empty]");
const words = () => [empty().querySelector(".empty-state-title").textContent, empty().querySelector(".empty-state-text").textContent];

test("a list with nothing to show says what is empty and what brings rows there", () => {
    drawn({empty: "No helpers running", hint: "A helper shows here while it works."});
    expect(words()).toEqual(["No helpers running", "A helper shows here while it works."]);
    expect(empty().hasAttribute("data-searching")).toBe(false);
});

test("with a search or a filter on, an empty list says nothing matches and what to try, not that it is empty", () => {
    drawn({empty: "No helpers running", hint: "A helper shows here while it works.", searching: true});
    expect(words()).toEqual(["Nothing matches", "Try other words, or clear the search."]);
    expect(empty().hasAttribute("data-searching")).toBe(true);
});

test("a window names what matches in its own words", () => {
    drawn({empty: "No edits yet", hint: "The files an agent changes show here.", searching: true, matches: "No file matches"});
    expect(words()[0]).toBe("No file matches");
});

test("a list with rows shows neither", () => {
    drawn({empty: "No helpers running", hint: "A helper shows here.", searching: true}, [{id: 1}]);
    expect(empty()).toBeNull();
});

test("a list tool says it is filtering once words are typed or open and closed is chosen, and not before", () => {
    const rows = ref([{id: 1, title: "One", open: true}]);
    const plain = useListTools(rows, {title: (row) => row.title});
    expect(plain.filtering.value).toBe(false);
    plain.words.value = "  ";
    expect(plain.filtering.value).toBe(false);
    plain.words.value = "one";
    expect(plain.filtering.value).toBe(true);
    const states = useListTools(rows, {title: (row) => row.title, isOpen: (row) => row.open});
    expect(states.filtering.value).toBe(false);
    states.state.value = "closed";
    expect(states.filtering.value).toBe(true);
});

const closedAgent = {id: 9, session: "s-9", program: "claude", role: "worker", ended_at: "2026-11-02T10:00:00Z", created_at: "2026-11-02T09:00:00Z"};

async function agents(component, answers) {
    const element = await mounted(component, context({"agent cards --options": agentFilterOptions, ...answers, "agent cards": answers?.["agent cards"] || page([]), "usage agents --closed": page([])}));
    document.body.append(element);
    host = element;
    return element;
}

const type = async (element, text) => {
    const box = element.querySelector("[data-search-input]");
    box.value = text;
    box.dispatchEvent(new Event("input", {bubbles: true}));
    await settle();
};

test("the running tab of the helpers window with none running says so and what brings one, though closed helpers exist", async () => {
    const element = await agents(helpers);
    expect(words()).toEqual(["No helpers working", "Helpers with a running process appear here."]);
    expect(element.textContent).not.toContain("Nothing matches");
});

test("a search of the helpers window that finds none says nothing matches", async () => {
    const element = await agents(helpers, {"agent cards --show running --search \"no such helper\"": page([]), "agent cards": page([{...closedAgent, id: 8, ended_at: null}])});
    await type(element, "no such helper");
    expect(words()[0]).toBe("Nothing matches");
});

test("the other tabs of the helpers window say what is empty in their own terms", async () => {
    const element = await agents(helpers, {"agent cards": page([])});
    const pick = (label) => pickButton(element, label, ".segmented button");
    await pick("Idle");
    expect(words()).toEqual(["No helpers idle", "Kept helpers whose process has stopped appear here."]);
    await pick("Retired");
    expect(words()).toEqual(["No helpers retired", "Retired helpers appear here."]);
    await pick("All");
    expect(words()).toEqual(["No helpers yet", "Helpers started by the agent appear here."]);
});

test("a window with no texts declared says its one empty line on every tab", async () => {
    const element = await mounted({render: () => h(AgentRows, {line: "agent list", empty: "No agents yet"})}, context({"agent list": page([]), "agent running": page([]), "usage agents --closed": page([])}));
    document.body.append(element);
    host = element;
    expect(words()[0]).toBe("No agents yet");
});

test("the memories window says it is empty, and once words are typed that no memory matches", async () => {
    const element = await mounted(MemoriesPage, context({"environment list": page([]), "memory list": page([]), "memory agents": page([])}));
    document.body.append(element);
    host = element;
    expect(element.querySelector("[data-memory-empty]").textContent).toContain("No memories yet");
    expect(element.querySelector("[data-memory-empty]").textContent).toContain("Memories you or the agent save appear here.");
    const box = element.querySelector("[data-search-input]");
    box.value = "cart";
    box.dispatchEvent(new Event("input", {bubbles: true}));
    await settle();
    expect(element.querySelector("[data-memory-empty]").textContent).toContain("No memory here matches");
});

// every list of every window declares what brings rows there, so none can say only that it is empty
const WEB_FOLDERS = ["core/modules", "suites"];
function vueFiles(folder) {
    return readdirSync(folder, {withFileTypes: true}).flatMap((entry) => {
        const path = join(folder, entry.name);
        if (entry.isDirectory()) return ["node_modules", "dist"].includes(entry.name) ? [] : vueFiles(path);
        return entry.name.endsWith(".vue") ? [path] : [];
    });
}

test("each RowList in a window declares its hint", () => {
    const missing = [];
    for (const folder of WEB_FOLDERS) {
        for (const path of vueFiles(resolve(__dirname, "../..", folder))) {
            for (const [tag] of readFileSync(path, "utf8").matchAll(/<RowList\b[^>]*>/g)) if (!/\bhint=/.test(tag)) missing.push(path.split("/src/").slice(-2).join("/src/"));
        }
    }
    expect(missing).toEqual([]);
});
