import {createApp, h} from "vue";
import {afterEach, expect, test} from "vitest";
import CreateDialog from "../kit/CreateDialog.vue";
import {settle} from "./support/windowContext.js";

afterEach(() => (document.body.innerHTML = ""));

const FIELDS = [
    {key: "title", label: "Title", required: true, placeholder: "Plan: release"},
    {key: "kind", label: "Applies to", kind: "select", options: [["plan", "Plans"], ["task", "Tasks"]]},
    {key: "commands", label: "Commands", kind: "area", when: (values) => values.kind === "plan"},
];

function dialog(run, check) {
    const sent = [];
    const element = document.createElement("div");
    document.body.append(element);
    createApp({
        render: () => h(CreateDialog, {title: "New template", fields: FIELDS, submit: "Make", command: (values) => `journal template make "${values.title || "…"}" --applies-to ${values.kind}`, check, run: async (values) => (sent.push({...values}), run(values)), onDone: (values) => sent.push("done"), onClose: () => sent.push("closed")}),
    }).mount(element);
    return sent;
}
const type = async (name, text) => {
    const field = document.body.querySelector(`[data-field="${name}"]`);
    field.value = text;
    field.dispatchEvent(new Event(field.tagName === "SELECT" ? "change" : "input", {bubbles: true}));
    await settle();
};
const send = async () => {
    document.body.querySelector("[data-create-send]").click();
    await settle();
};

test("test_command_preview: the command updates as the fields are filled, and a field shows only when its condition holds", async () => {
    dialog(() => ({ok: true}));
    expect(document.body.querySelector("[data-command-preview]").textContent).toBe('journal template make "…" --applies-to plan');
    await type("title", "Plan: release");
    expect(document.body.querySelector("[data-command-preview]").textContent).toBe('journal template make "Plan: release" --applies-to plan');
    expect(document.body.querySelector('[data-field="commands"]')).not.toBeNull();
    await type("kind", "task");
    expect(document.body.querySelector('[data-field="commands"]')).toBeNull();
    expect(document.body.querySelector("[data-create-send]").disabled).toBe(false);
});

test("test_refusal_shown: a refused value stays and says why under its field, and the server's refusal is shown in place with the dialog open", async () => {
    const sent = dialog(() => ({ok: false, error: "A template needs a brief"}), (values) => (values.title === "bad" ? {title: "Name taken"} : {}));
    expect(document.body.querySelector("[data-create-send]").disabled).toBe(true);
    await type("title", "bad");
    await send();
    expect(document.body.querySelector('[data-refused="title"]').textContent).toBe("Name taken");
    expect(sent).toEqual([]);
    expect(document.body.querySelector('[data-field="title"]').value).toBe("bad");
    await type("title", "good");
    await send();
    expect(sent[0]).toMatchObject({title: "good"});
    expect(document.body.querySelector("[data-create-failure]").textContent).toBe("A template needs a brief");
    expect(sent).not.toContain("closed");
});

test("a run that goes through closes the dialog", async () => {
    const sent = dialog(() => ({ok: true}));
    await type("title", "Plan: release");
    await send();
    expect(sent.slice(-2)).toEqual(["done", "closed"]);
});
