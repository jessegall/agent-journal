<script setup>
import SettingChoiceField from "./SettingChoiceField.vue";
import SettingSegments from "./SettingSegments.vue";

// the context size of each kind of agent: a row for each kind with three choices, the size set for every agent, a size
// of its own, or no cap. It takes and gives the list the server reads, one kind:tokens text for each kind that
// is not left on the default, and keeps the entries of kinds it has no row for.
const props = defineProps({
    modelValue: {type: Array, default: () => []},
    rows: {type: Array, required: true},
    sizes: {type: Array, required: true},
    defaultCap: {type: Number, required: true},
    disabled: {type: Boolean, default: false},
});
const emit = defineEmits(["update:modelValue"]);

const NO_CAP = "none";
const MODES = [{value: "default", label: "Default cap"}, {value: "size", label: "A size"}, {value: "none", label: "No cap"}];
const sizeText = (size) => `${size / 1000}k`;
const entryOf = (text) => {
    const at = text.lastIndexOf(":");
    return {kind: text.slice(0, at).trim(), value: text.slice(at + 1).trim()};
};
const valueOf = (key) => props.modelValue.map(entryOf).find((entry) => entry.kind === key)?.value;
const modeOf = (key) => {
    const value = valueOf(key);
    return value === undefined ? "default" : value === NO_CAP ? "none" : "size";
};
const sizeOf = (key) => Number(valueOf(key));
const sourceOf = (key) => ({default: `Uses the size set for every agent: ${sizeText(props.defaultCap)}`, size: "Its own size", none: "Never compacted at a size"})[modeOf(key)];
const startSize = () => (props.sizes.includes(props.defaultCap) ? props.defaultCap : props.sizes[0]);

function give(values) {
    const known = new Set(props.rows.map((row) => row.key));
    const others = props.modelValue.filter((text) => !known.has(entryOf(text).kind));
    const own = props.rows.filter((row) => values[row.key] !== undefined).map((row) => `${row.key}:${values[row.key]}`);
    emit("update:modelValue", [...own, ...others]);
}

function change(key, mode, size) {
    const values = Object.fromEntries(props.rows.map((row) => [row.key, valueOf(row.key)]));
    values[key] = mode === "default" ? undefined : mode === "none" ? NO_CAP : size ?? (modeOf(key) === "size" ? sizeOf(key) : startSize());
    give(values);
}
</script>

<template>
    <div class="setting-caps">
        <template v-for="row in rows" :key="row.key">
            <div class="cap-row" :data-cap-row="row.key">
                <div class="who">
                    <span class="name">{{ row.name }}</span>
                    <span class="where">{{ sourceOf(row.key) }}</span>
                </div>
                <SettingSegments :model-value="modeOf(row.key)" :options="MODES" :disabled="disabled" @update:model-value="(mode) => change(row.key, mode)" />
                <template v-if="modeOf(row.key) === 'size'">
                    <SettingChoiceField :model-value="sizeOf(row.key)" :choices="sizes" :disabled="disabled" :data-cap-size="row.key" @update:model-value="(size) => change(row.key, 'size', size)" />
                </template>
            </div>
        </template>
    </div>
</template>

<style scoped>
.setting-caps { display: flex; flex-direction: column; width: 100%; }
.cap-row { display: grid; grid-template-columns: minmax(0, 1fr) auto auto; gap: 12px; align-items: center; padding: 8px 0; border-top: 1px solid var(--border); }
.cap-row:first-child { border-top: 0; }
.who { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.name { color: var(--text); font-size: 12.8px; }
.where { color: var(--text-3); font-size: 11.5px; }
</style>
