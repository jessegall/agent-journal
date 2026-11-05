import {createApp, h, ref} from "vue";
import {afterEach, expect, test} from "vitest";
import PaneMenuOptions from "../src/panes/PaneMenuOptions.vue";
import {CHAT_WINDOW, withFamilyOptions} from "../src/windows/chatOptions.js";
import {isMainOnly} from "../src/domain/markFamilies.js";
import {settled} from "./settled.js";

const TYPES = [
    {type: "memory", family: "memories.memories", family_title: "Memories", group: "memory", group_label: "Memory", shown: true, main: true},
    {type: "reminder", family: "memories.reminders", family_title: "Reminders", group: "memory", group_label: "Memory", shown: false, main: false},
    {type: "task", family: "tasks.tasks", family_title: "Tasks", group: "task", group_label: "Task", shown: true, main: true},
];
const declared = withFamilyOptions([{name: CHAT_WINDOW, options: []}], TYPES)[0].options;
let drawn = [];

// the chat's pane menu over a pane that keeps its options, as the stage keeps them
function menu(options = declared) {
    const values = ref({});
    const element = document.createElement("div");
    document.body.append(element);
    const app = createApp(() => h(PaneMenuOptions, {declared: options, values: values.value, onSet: (key, value) => (values.value = {...values.value, [key]: value})}));
    app.mount(element);
    drawn.push({app, element});
    return {element, values};
}

// the marks are listed behind a fold, which a person opens
async function opened(options) {
    const shown = menu(options);
    await settled();
    shown.element.querySelector("[data-menu-marks]").click();
    await settled();
    return shown;
}

afterEach(() => {
    drawn.forEach(({app, element}) => (app.unmount(), element.remove()));
    drawn = [];
});

test("the chat's menu lists each group with Main updates only and a switch for each type in it, after the presets", async () => {
    const {element} = await opened();
    const keys = [...element.querySelectorAll("[data-option]")].map((control) => control.dataset.option);
    expect(keys).toEqual(["show-preset", "main-only-memory", "show-memories.memories", "show-memories.reminders", "main-only-task", "show-tasks.tasks"]);
    expect([...element.querySelectorAll("[data-group]")].map((heading) => heading.textContent)).toEqual(["Memory", "Task"]);
    expect(element.querySelector('[data-option="main-only-memory"]').textContent).toBe("Main updates only");
});

test("Main updates only switches a group's types without a main mark off on the pane, and again switches them all on", async () => {
    const {element, values} = await opened();
    const press = element.querySelector('[data-option="main-only-memory"]');
    press.click();
    await settled();
    expect(values.value).toEqual({"show-memories.memories": true, "show-memories.reminders": false});
    expect(press.getAttribute("aria-pressed")).toBe("true");
    expect(isMainOnly(TYPES, "memory", (key) => values.value[key])).toBe(true);
    press.click();
    await settled();
    expect(values.value).toEqual({"show-memories.memories": true, "show-memories.reminders": true});
    expect(press.getAttribute("aria-pressed")).toBe("false");
});

// the types as the modules declare them, with the group label every type carries unformatted and two families that once shared a title
const DECLARED = [
    {type: "dispatch", family: "drivers.dispatches", family_title: "Helper dispatches", group: "agent", group_label: "{family}: {count} updates", shown: true, main: true},
    {type: "helper", family: "agents.helpers", family_title: "Helpers", group: "agent", group_label: "{family}: {count} helper updates", shown: true, main: true},
    {type: "fault", family: "chat.faults", family_title: "Faults", group: "journal", group_label: "{family}: {count} updates", shown: false, main: false},
    {type: "task", family: "tasks.tasks", family_title: "Tasks", group: "work", group_label: "{family}: {count} updates", shown: true, main: true},
    {type: "memory", family: "memories.memories", family_title: "Memories", group: "reminders", group_label: "{family}: {count} updates", shown: true, main: true},
];
const realMenu = withFamilyOptions([{name: CHAT_WINDOW, options: [{control: "choice", key: "figure", label: "Figure", choices: [["none", "None"], ["butler", "Butler"]], default: "none"}]}], DECLARED)[0].options;

test("no raw placeholder shows in the chat's menu, whether its marks are folded or open", async () => {
    const {element} = menu(realMenu);
    await settled();
    expect(element.textContent).not.toMatch(/[{}]|\bcount\b|\bfamily\b/);
    element.querySelector("[data-menu-marks]").click();
    await settled();
    expect(element.textContent).not.toMatch(/[{}]|\bcount\b|\bfamily\b/);
});

test("each group is named in plain words and no entry of the menu repeats", async () => {
    const {element} = await opened(realMenu);
    expect([...element.querySelectorAll("[data-group]")].map((heading) => heading.textContent)).toEqual(["The agent", "The journal", "Work", "Reminders"]);
    const switches = [...element.querySelectorAll('[data-option^="show-"]:not([data-option="show-preset"])')].map((entry) => entry.textContent.replace("✓", "").trim());
    expect(switches).toEqual(["Helper dispatches", "Helpers", "Faults", "Tasks", "Memories"]);
    expect(new Set(switches).size).toBe(switches.length);
    const keys = [...element.querySelectorAll("[data-option]")].map((entry) => entry.dataset.option);
    expect(new Set(keys).size).toBe(keys.length);
});

test("the marks stay behind a fold until it is opened, and the figure and presets are labelled choices", async () => {
    const {element} = menu(realMenu);
    await settled();
    expect(element.querySelector('[data-option="show-tasks.tasks"]')).toBeNull();
    expect([...element.querySelectorAll("[data-option] > .menu-label")].map((label) => label.textContent)).toEqual(["Figure", "Show in chat"]);
    expect([...element.querySelectorAll('[data-option="show-preset"] [data-choice]')].map((choice) => choice.textContent.replace("✓", "").trim())).toEqual(["Only chat", "Chat with context", "All updates"]);
    const row = element.querySelector('[data-option="show-preset"]');
    expect(row.querySelector("[data-menu-inner-list]").style.display).toBe("none");
    row.querySelector("[data-menu-inner]").click();
    await settled();
    expect(row.querySelector("[data-menu-inner-list]").style.display).toBe("");
    row.querySelector("[data-menu-back]").click();
    await settled();
    expect(row.querySelector("[data-menu-inner-list]").style.display).toBe("none");
    element.querySelector("[data-menu-marks]").click();
    await settled();
    expect(element.querySelector('[data-option="show-tasks.tasks"]')).not.toBeNull();
    element.querySelector("[data-menu-marks]").click();
    await settled();
    expect(element.querySelector('[data-option="show-tasks.tasks"]')).toBeNull();
});

test("a switch for one type is kept on the pane beside the group's main-only choice", async () => {
    const {element, values} = await opened();
    element.querySelector('[data-option="show-tasks.tasks"]').click();
    await settled();
    expect(values.value).toEqual({"show-tasks.tasks": false});
    expect(element.querySelector('[data-option="show-tasks.tasks"]').getAttribute("aria-pressed")).toBe("false");
});
