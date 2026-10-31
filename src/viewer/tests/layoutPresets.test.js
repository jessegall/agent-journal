import {createApp, h, nextTick} from "vue";
import {afterEach, expect, test, vi} from "vitest";
import LayoutThumb from "../src/kit/LayoutThumb.vue";
import {useLayoutPresets} from "../src/windows/layoutPresets.js";
import {WindowCatalogue} from "../src/windows/windowCatalogue.js";
import {paneLayout} from "../src/windows/paneLayout.js";
import {leaves} from "../src/domain/panes.js";

const offered = (name, extra = {}) => ({name, title: name, icon: "window", options: [{control: "toggle", key: "hide", label: "Hide", default: false}], unavailable_reason: "", ...extra});
const CHAT = {windows: ["messages.chat"], active: "messages.chat"};
const SUITE_PRESETS = [
    {key: "default", name: "Default", text: "Chat and tasks", shape: {direction: "row", share: 0.6, first: CHAT, second: {windows: ["tasks.tasks"], active: "tasks.tasks"}}},
    {key: "ghost", name: "Ghost", text: "A window no module offers", shape: CHAT.windows && {windows: ["nobody.window"], active: "nobody.window"}},
    {key: "blocked", name: "Blocked", text: "A window that cannot run", shape: {windows: ["old.board"], active: "old.board"}},
];

async function presets({person = []} = {}) {
    const lines = [];
    const shellLine = async (line) => {
        lines.push(line);
        const words = line.join(" ");
        if (words.startsWith("suite presets main home")) return {ok: true, value: {presets: SUITE_PRESETS}};
        if (words.startsWith("person-preset list")) return {ok: true, value: {presets: person}};
        return {ok: true, value: {id: 9}};
    };
    const catalogue = new WindowCatalogue(async () => ({windows: []}));
    catalogue.windows.value = [offered("messages.chat"), offered("tasks.tasks"), offered("old.board", {unavailable_reason: "Needs window kit 2."})];
    const store = paneLayout({
        saved: async () => null,
        defaults: async () => ({dir: "row", r: 0.5, a: {tabs: ["messages.chat"], active: "messages.chat"}, b: {tabs: ["tasks.tasks"], active: "tasks.tasks"}}),
        save: async () => ({ok: true, version: 1}),
        tab: {read: () => null, write: () => {}},
        entry: (name) => catalogue.window(name),
    });
    await store.load({environment: "main", person: 1, suite: "coding", page: "home", driver: "coding.builder"});
    const list = useLayoutPresets({environment: "main", page: "home", shellLine, catalogue, store});
    await list.load();
    return {list, lines, store};
}

afterEach(() => vi.unstubAllGlobals());

test("applying a preset keeps the options of a pane holding the same active window", async () => {
    const {list, store} = await presets();
    const chat = leaves(store.layout.value.tree).find((id) => store.layout.value.panes[id].active === "messages.chat");
    store.replace({...store.layout.value, panes: {...store.layout.value.panes, [chat]: {...store.layout.value.panes[chat], options: {hide: true}}}});
    list.apply("default");
    const after = store.layout.value;
    const kept = leaves(after.tree).find((id) => after.panes[id].active === "messages.chat");
    expect(after.panes[kept].options).toEqual({hide: true});
    expect(after.tree.r).toBe(0.6);
});

test("a preset naming a window no module offers, or one that is unavailable, is hidden", async () => {
    const {list} = await presets();
    expect(list.presets.value.map((preset) => preset.key)).toEqual(["default"]);
});

test("a preset's thumbnail draws one cell per pane, and the thumb component draws them", async () => {
    const {list} = await presets();
    const cells = list.presets.value[0].cells;
    expect(cells).toHaveLength(2);
    const element = document.createElement("div");
    createApp(() => h(LayoutThumb, {cells})).mount(element);
    await nextTick();
    expect(element.querySelectorAll(".layout-cell")).toHaveLength(2);
});

test("save, update, rename and remove call the person-preset commands for the page", async () => {
    const person = [{id: 7, name: "Mine", shape: JSON.stringify({tabs: ["messages.chat"], active: "messages.chat"})}];
    const {list, lines} = await presets({person});
    const calls = () => lines.filter((line) => line[0] === "person-preset" && line[1] !== "list");
    await list.save("Review");
    await list.update("person:7");
    await list.rename("person:7", "Review mine");
    await list.remove("person:7");
    expect(calls().map((line) => line.slice(0, 2).join(" "))).toEqual(["person-preset save", "person-preset save", "person-preset rename", "person-preset remove"]);
    expect(calls()[0]).toEqual(expect.arrayContaining(["--page", "home", "--name", "Review", "--shape"]));
    expect(calls()[1]).toEqual(expect.arrayContaining(["--name", "Mine"]));
    expect(calls()[2]).toEqual(["person-preset", "rename", "7", "--name", "Review mine"]);
    expect(calls()[3]).toEqual(["person-preset", "remove", "7"]);
});

test("share downloads the layout as a .layout.json file", async () => {
    const person = [{id: 7, name: "Mine", shape: JSON.stringify({tabs: ["messages.chat"], active: "messages.chat"})}];
    const {list} = await presets({person});
    const made = [];
    vi.stubGlobal("URL", {createObjectURL: (blob) => (made.push(blob), "blob:layout"), revokeObjectURL: () => {}});
    const clicked = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(function () {
        made.push(this.download);
    });
    list.share("person:7");
    expect(made[1]).toBe("Mine.layout.json");
    expect(JSON.parse(await made[0].text())).toEqual({name: "Mine", shape: {tabs: ["messages.chat"], active: "messages.chat"}});
    clicked.mockRestore();
});

test("importing a layout file saves it, keeping windows the suite does not offer", async () => {
    const {list, lines} = await presets();
    const shape = {dir: "row", r: 0.5, a: {tabs: ["messages.chat"], active: "messages.chat"}, b: {tabs: ["nobody.window"], active: "nobody.window"}};
    await list.importLayout({name: "From a friend", shape});
    const save = lines.find((line) => line[0] === "person-preset" && line[1] === "save");
    expect(save).toEqual(expect.arrayContaining(["--name", "From a friend"]));
    expect(JSON.parse(save[save.indexOf("--shape") + 1])).toEqual(shape);
});
