import {createApp, h, ref} from "vue";
import {afterEach, expect, test} from "vitest";
import PaneMenuOptions from "../src/panes/PaneMenuOptions.vue";
import {CHAT_WINDOW, withFamilyOptions} from "../src/windows/chatOptions.js";
import {isMainOnly} from "../src/domain/markFamilies.js";
import {settled} from "./settled.js";

const KINDS = [
    {type: "memory", family: "memories.memories", family_title: "Memories", group: "memory", group_label: "Memory", shown: true, main: true},
    {type: "reminder", family: "memories.reminders", family_title: "Reminders", group: "memory", group_label: "Memory", shown: false, main: false},
    {type: "task", family: "tasks.tasks", family_title: "Tasks", group: "task", group_label: "Task", shown: true, main: true},
];
const declared = withFamilyOptions([{name: CHAT_WINDOW, options: []}], KINDS)[0].options;
let drawn = [];

// the chat's pane menu over a pane that keeps its options, as the stage keeps them
function menu() {
    const values = ref({});
    const element = document.createElement("div");
    document.body.append(element);
    const app = createApp(() => h(PaneMenuOptions, {declared, values: values.value, onSet: (key, value) => (values.value = {...values.value, [key]: value})}));
    app.mount(element);
    drawn.push({app, element});
    return {element, values};
}

afterEach(() => {
    drawn.forEach(({app, element}) => (app.unmount(), element.remove()));
    drawn = [];
});

test("the chat's menu lists each group with Only its main marks and a switch for each kind in it, after the presets", async () => {
    const {element} = menu();
    await settled();
    const keys = [...element.querySelectorAll("[data-option]")].map((control) => control.dataset.option);
    expect(keys).toEqual(["show-preset", "main-only-memory", "show-memories.memories", "show-memories.reminders", "main-only-task", "show-tasks.tasks"]);
    expect([...element.querySelectorAll("[data-group]")].map((heading) => heading.textContent)).toEqual(["Memory", "Task"]);
    expect(element.querySelector('[data-option="main-only-memory"]').textContent).toBe("Only its main marks");
});

test("Only its main marks switches a group's kinds without a main mark off on the pane, and again switches them all on", async () => {
    const {element, values} = menu();
    await settled();
    const press = element.querySelector('[data-option="main-only-memory"]');
    press.click();
    await settled();
    expect(values.value).toEqual({"show-memories.memories": true, "show-memories.reminders": false});
    expect(press.getAttribute("aria-pressed")).toBe("true");
    expect(isMainOnly(KINDS, "memory", (key) => values.value[key])).toBe(true);
    press.click();
    await settled();
    expect(values.value).toEqual({"show-memories.memories": true, "show-memories.reminders": true});
    expect(press.getAttribute("aria-pressed")).toBe("false");
});

test("a switch for one kind is kept on the pane beside the group's main-only choice", async () => {
    const {element, values} = menu();
    await settled();
    element.querySelector('[data-option="show-tasks.tasks"]').click();
    await settled();
    expect(values.value).toEqual({"show-tasks.tasks": false});
    expect(element.querySelector('[data-option="show-tasks.tasks"]').getAttribute("aria-pressed")).toBe("false");
});
