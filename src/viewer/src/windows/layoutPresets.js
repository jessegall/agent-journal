import {computed, ref} from "vue";
import {arrangedShape} from "./homeLayout.js";
import {arranged, matches, shapeViews, snapshot, thumbnail} from "../domain/panes.js";

const SAVED_TEXT = "Saved layout";

// the layouts a person can switch a page to: the suite's presets whose windows are all offered and available, then the
// person's own saved layouts, which keep any window; applying one arranges the live layout so panes holding the same
// active window keep their options, and a person's layout is saved, updated, renamed, removed, shared as a
// .layout.json file and imported through the person-preset commands
export function useLayoutPresets({environment, page, shellLine, catalogue, store}) {
    const suite = ref([]);
    const person = ref([]);

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
        store.apply(arranged(store.layout.value, find(key).shape));
    }

    async function keep(name, shape) {
        await shellLine(["person-preset", "save", "--page", page, "--name", name, "--shape", JSON.stringify(shape)]);
        await reload();
    }

    const save = (name) => keep(name, snapshot(store.layout.value));
    const update = (key) => keep(find(key).name, snapshot(store.layout.value));
    const importLayout = ({name, shape}) => keep(name, shape);

    async function rename(key, name) {
        await shellLine(["person-preset", "rename", String(find(key).id), "--name", name]);
        await reload();
    }

    async function remove(key) {
        await shellLine(["person-preset", "remove", String(find(key).id)]);
        await reload();
    }

    function share(key) {
        const {name, shape} = find(key);
        const link = document.createElement("a");
        link.href = URL.createObjectURL(new Blob([JSON.stringify({name, shape})], {type: "application/json"}));
        link.download = `${name}.layout.json`;
        link.click();
        URL.revokeObjectURL(link.href);
    }

    return {presets, load, apply, save, update, rename, remove, share, importLayout};
}
