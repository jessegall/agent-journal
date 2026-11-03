<script setup>
import {MenuItem, SearchBar, Segmented} from "@journal/window-kit";

// the file feed's bar, as version 4's: filter the files, and the view menu
const props = defineProps({options: {type: Object, required: true}, filter: {type: String, default: ""}});
const emit = defineEmits(["options", "filter", "expand"]);
const TOGGLES = [
    {key: "headers", label: "Headers only"},
    {key: "collapse", label: "Collapse big files"},
    {key: "editsOnly", label: "Hide unchanged lines"},
    {key: "removals", label: "Show removals"},
    {key: "flush", label: "Flush"},
    {key: "columns", label: "Always two columns"},
    {key: "capped", label: "Limit card height"},
];
const SIZES = [-1, 0, 1];
const LINES = [
    {key: "0", label: "All"},
    {key: "5", label: "5"},
    {key: "10", label: "10"},
    {key: "20", label: "20"},
];
const limited = (key) => key === "collapse" && Number(props.options.lines) > 0;
const set = (patch) => emit("options", {...props.options, ...patch});
const sized = (by) => set({size: Math.max(SIZES[0], Math.min(SIZES[SIZES.length - 1], props.options.size + by))});
</script>

<template>
        <SearchBar :model-value="filter" data-feed-bar data-feed-filter @update:model-value="emit('filter', $event)">
            <template #menu>
                <template v-for="toggle in TOGGLES" :key="toggle.key">
                    <MenuItem :data-feed-toggle="toggle.key" :checked="Boolean(options[toggle.key]) && !limited(toggle.key)" :aria-pressed="Boolean(options[toggle.key]) && !limited(toggle.key)" :disabled="limited(toggle.key)" @click="set({[toggle.key]: !options[toggle.key]})">{{ toggle.label }}</MenuItem>
                </template>
                <MenuItem data-feed-expand :checked="false" @click="emit('expand')">Expand everything</MenuItem>
                <MenuItem data-feed-smaller :checked="false" :disabled="options.size <= SIZES[0]" @click="sized(-1)">Smaller text</MenuItem>
                <MenuItem data-feed-larger :checked="false" :disabled="options.size >= SIZES[SIZES.length - 1]" @click="sized(1)">Larger text</MenuItem>
                <div class="feed-bar-lines">
                    <span>Lines</span>
                    <Segmented :options="LINES" :value="String(options.lines || 0)" @pick="(key) => set({lines: Number(key)})" />
                </div>
            </template>
        </SearchBar>
</template>

<style scoped>
.feed-bar-lines {
    display: flex;
    flex-direction: column;
    gap: 6px;
    align-items: flex-start;
    padding: 6px 10px;
    font-size: 13px;
}
</style>
