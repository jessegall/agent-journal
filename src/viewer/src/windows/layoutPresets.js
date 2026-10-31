import {computed, ref} from "vue";
import {arrangedShape} from "./homeLayout.js";
import {arranged, matches, shapeViews, snapshot, thumbnail} from "../domain/panes.js";

const NOT_A_LAYOUT = "That isn't a saved layout. Share one with a layout's share button.";
const SAVED_TEXT = "Saved layout";

// the layouts a person can switch a page to: the suite's presets whose windows are all offered and available, then the
// person's own saved layouts, which keep any window; applying one arranges the live layout so panes holding the same
// active window keep their options, and a person's layout is saved, updated, renamed, removed, shared as a
// .layout.json file and imported through the person-preset commands
export function useLayoutPresets({environment, page, shellLine, catalogue, store}) {
    const suite = ref([]);
    const person = ref([]);
    const notice = ref("");

    async function load() {
        const offered = await shellLine(["suite", "presets", environment, page]);
        suite.value = offered.ok && offered.value?.presets ? offered.value.presets.map((preset) => ({...preset, shape: arrangedShape(preset.shape)})) : [];
        await reload();
    }

    async function reload() {
        const own = await shellLine(["person-preset", "list", "--page", page]);
        person.value = own.ok && own.value?.presets ? own.value.presets.map((row) => ({key: `person:${row.id}`, id: row.id, name: row.name, text: SAVED_TEXT, saved: true, shape: JSON.parse(row.shape)})) : [];
    }

    const usable = (name) => {
        const entry = catalogue.window(name);
        return Boolean(entry) && !entry.unavailable_reason;
    };
    const presets = computed(() =>
        [...suite.value.filter((preset) => shapeViews(preset.shape).every(usable)), ...person.value].map((preset) => ({
            ...preset,
            cells: thumbnail(preset.shape),
            current: store.layout.value ? matches(store.layout.value, preset.shape) : false,
        })),
    );
    const find = (key) => presets.value.find((preset) => preset.key === key);

    function apply(key) {
        const preset = find(key);
        if (!preset) return void (notice.value = "That layout is not available.");
        store.apply(arranged(store.layout.value, preset.shape));
    }

    const wellMade = (shape) =>
        Boolean(shape) && typeof shape === "object" && (Array.isArray(shape.tabs) ? shape.tabs.every((name) => typeof name === "string") : ["row", "col"].includes(shape.dir) && wellMade(shape.a) && wellMade(shape.b));
    const taken = (name) => person.value.some((preset) => preset.name.toLowerCase() === name.trim().toLowerCase());

    async function ask(line) {
        const answer = await shellLine(line);
        if (!answer.ok) notice.value = answer.error;
        return answer.ok;
    }

    async function keep(name, shape) {
        if (await ask(["person-preset", "save", "--page", page, "--name", name, "--shape", JSON.stringify(shape)])) {
            notice.value = "";
            await reload();
        }
    }

    function named(name) {
        if (!name || !name.trim()) notice.value = "Give the layout a name.";
        else if (taken(name)) notice.value = `A layout named ${name.trim()} already exists.`;
        else return true;
        return false;
    }

    function saved(key) {
        const preset = person.value.find((one) => one.key === key);
        if (!preset) notice.value = "That layout no longer exists.";
        return preset;
    }

    const save = async (name) => named(name) && keep(name.trim(), snapshot(store.layout.value));
    const update = async (key) => saved(key) && keep(saved(key).name, snapshot(store.layout.value));

    async function importLayout(file) {
        if (typeof file?.name !== "string" || !wellMade(file.shape)) {
            notice.value = NOT_A_LAYOUT;
            return;
        }
        if (named(file.name)) await keep(file.name.trim(), file.shape);
    }

    async function rename(key, name) {
        const preset = saved(key);
        if (preset && named(name) && (await ask(["person-preset", "rename", String(preset.id), "--name", name.trim()]))) {
            notice.value = "";
            await reload();
        }
    }

    async function remove(key) {
        const preset = saved(key);
        if (preset && (await ask(["person-preset", "remove", String(preset.id)]))) {
            notice.value = "";
            await reload();
        }
    }

    function share(key) {
        const preset = find(key);
        if (!preset) return void (notice.value = "That layout no longer exists.");
        const {name, shape} = preset;
        const link = document.createElement("a");
        link.href = URL.createObjectURL(new Blob([JSON.stringify({name, shape})], {type: "application/json"}));
        link.download = `${name}.layout.json`;
        link.click();
        URL.revokeObjectURL(link.href);
    }

    return {presets, notice, load, apply, save, update, rename, remove, share, importLayout};
}
