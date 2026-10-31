import {createApp, h} from "vue";
import {expect, test} from "vitest";
import {settled} from "./settled.js";
import SettingsTree from "../../core/modules/settings/web/src/SettingsTree.vue";
import {WINDOW_CONTEXT} from "../kit/windowContextKey.js";

const row = (fields) => ({parent: null, description: "", secret: false, scope: "both", agent_writable: false, choices: [], toggleable: false, value: null, shown: "not set", source: "default", ...fields});
const TREE = [
    row({key: "good.limit", title: "Limit", description: "How many rows a list shows.", type: "number", value: 50, shown: "50"}),
    row({key: "good.sharing", title: "Sharing", description: "Links that show one row.", type: "group", shown: "on"}),
    row({key: "good.sharing.tunnel", parent: "good.sharing", title: "Tunnel", description: "How a phone reaches this computer.", type: "group", toggleable: true, shown: "on", value: true}),
    row({key: "good.sharing.tunnel.address", parent: "good.sharing.tunnel", title: "Address", type: "text", scope: "project", value: "https://tunnel.example.com", shown: "https://tunnel.example.com"}),
    row({key: "good.sharing.tunnel.token", parent: "good.sharing.tunnel", title: "Token", type: "text", secret: true, scope: "project", shown: "not set"}),
    row({key: "good.sharing.face", parent: "good.sharing", title: "Face", type: "choice", choices: ["dark", "light"], value: "dark", shown: "dark"}),
    row({key: "good.sharing.notify", parent: "good.sharing", title: "Notify", type: "flag", value: false, shown: "False"}),
];

function mounted({rows = TREE, runAnswer = {ok: true, value: null}, face = "person"} = {}) {
    const runs = [];
    const context = {read: async () => ({ok: true, value: {rows}}), run: async (words) => (runs.push(words), runAnswer), follow: () => {}, face};
    const element = document.createElement("div");
    createApp({setup: () => () => h(SettingsTree), provide: {[WINDOW_CONTEXT]: context}}).mount(element);
    return {element, runs};
}

const node = (element, key) => element.querySelector(`[data-setting="${key}"]`);

test("a group draws its title and description, and a nested group draws inside its parent", async () => {
    const {element} = mounted();
    await settled();
    expect(node(element, "good.sharing").textContent).toContain("Links that show one row.");
    expect(node(element, "good.sharing").contains(node(element, "good.sharing.tunnel"))).toBe(true);
    expect(node(element, "good.sharing.tunnel").contains(node(element, "good.sharing.tunnel.address"))).toBe(true);
});

test("each value draws a field of its type with its label above it", async () => {
    const {element} = mounted();
    await settled();
    expect(node(element, "good.limit").querySelector("input[type=number]").value).toBe("50");
    expect(node(element, "good.sharing.notify").querySelector("[role=switch]")).not.toBeNull();
    expect(node(element, "good.sharing.face").querySelector("select")).toBeNull();
    expect(node(element, "good.sharing.face").querySelectorAll("[data-choice]")).toHaveLength(2);
    const label = node(element, "good.limit").querySelector("label");
    expect(label.compareDocumentPosition(node(element, "good.limit").querySelector("input")) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
});

test("a changed value is saved with setting set, for the project where the setting is the project's", async () => {
    const {element, runs} = mounted();
    await settled();
    const input = node(element, "good.sharing.tunnel.address").querySelector("input");
    input.value = "https://tunnel.example.org";
    input.dispatchEvent(new Event("change"));
    await settled();
    expect(runs).toEqual([["setting", "set", "good.sharing.tunnel.address", "https://tunnel.example.org", "--project"]]);
});

test("a secret shows only whether it is set and its field writes without showing", async () => {
    const {element} = mounted();
    await settled();
    expect(node(element, "good.sharing.tunnel.token").textContent).toContain("not set");
    expect(node(element, "good.sharing.tunnel.token").querySelector("input").type).toBe("password");
    expect(node(element, "good.sharing.tunnel.token").querySelector("input").value).toBe("");
});

test("a toggleable group has a switch that runs setting switch", async () => {
    const {element, runs} = mounted();
    await settled();
    node(element, "good.sharing.tunnel").querySelector("[data-group-switch]").click();
    await settled();
    expect(runs).toEqual([["setting", "switch", "good.sharing.tunnel", "off", "--project"]]);
});

test("a refusal shows beside the field that was changed", async () => {
    const {element} = mounted({runAnswer: {ok: false, error: "good.limit is a number, not 'many'"}});
    await settled();
    const input = node(element, "good.limit").querySelector("input");
    input.value = "7";
    input.dispatchEvent(new Event("change"));
    await settled();
    expect(node(element, "good.limit").textContent).toContain("good.limit is a number, not 'many'");
});

test("on a phone every field is read-only and nothing runs", async () => {
    const {element, runs} = mounted({face: "phone"});
    await settled();
    expect([...element.querySelectorAll("input")].every((input) => input.disabled)).toBe(true);
    expect(element.querySelector("[data-group-switch]")).toBeNull();
    expect(runs).toEqual([]);
});
