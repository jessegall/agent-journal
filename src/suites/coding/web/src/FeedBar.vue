<script setup>
import {ref} from "vue";
import {Icon, MenuItem, MenuPanel, Segmented, TextInput} from "@journal/window-kit";

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
const anchor = ref(null);
const limited = (key) => key === "collapse" && Number(props.options.lines) > 0;
const set = (patch) => emit("options", {...props.options, ...patch});
const sized = (by) => set({size: Math.max(SIZES[0], Math.min(SIZES[SIZES.length - 1], props.options.size + by))});
const toggleMenu = (event) => (anchor.value = anchor.value ? null : event.currentTarget);

function expand() {
    anchor.value = null;
    emit("expand");
}
</script>

<template>
    <div class="feed-bar" data-feed-bar>
        <TextInput :model-value="filter" icon="search" class="feed-bar-filter" placeholder="Filter files" data-feed-filter @update:model-value="emit('filter', $event)" />
        <button type="button" class="feed-bar-view" data-feed-view :aria-expanded="Boolean(anchor)" @click="toggleMenu">
            View
            <Icon name="caret" :size="12" />
        </button>
        <template v-if="anchor">
            <MenuPanel :anchor="anchor" :min-width="250" :max-width="300" @click.stop @close="anchor = null">
                <template v-for="toggle in TOGGLES" :key="toggle.key">
                    <MenuItem :data-feed-toggle="toggle.key" :aria-pressed="Boolean(options[toggle.key]) && !limited(toggle.key)" :disabled="limited(toggle.key)" @click="set({[toggle.key]: !options[toggle.key]})">
                        {{ options[toggle.key] && !limited(toggle.key) ? "✓ " : "" }}{{ toggle.label }}
                    </MenuItem>
                </template>
                <MenuItem data-feed-expand @click="expand">Expand everything</MenuItem>
                <MenuItem data-feed-smaller :disabled="options.size <= SIZES[0]" @click="sized(-1)">Smaller text</MenuItem>
                <MenuItem data-feed-larger :disabled="options.size >= SIZES[SIZES.length - 1]" @click="sized(1)">Larger text</MenuItem>
                <div class="feed-bar-lines">
                    <span>Lines</span>
                    <Segmented :options="LINES" :value="String(options.lines || 0)" @pick="(key) => set({lines: Number(key)})" />
                </div>
            </MenuPanel>
        </template>
    </div>
</template>

<style scoped>
.feed-bar {
    display: flex;
    flex: none;
    gap: 8px;
    align-items: center;
    padding: 8px 12px;
    border-bottom: 1px solid var(--border);
}

.feed-bar-filter {
    flex: 1;
    min-width: 0;
}

.feed-bar-view {
    display: inline-flex;
    gap: 4px;
    align-items: center;
    padding: 3px 8px;
    border: 1px solid var(--border);
    border-radius: 6px;
    background: var(--surface);
    color: inherit;
    font-size: 12.5px;
    cursor: pointer;
}

.feed-bar-lines {
    display: flex;
    gap: 8px;
    align-items: center;
    justify-content: space-between;
    padding: 6px 10px;
    font-size: 13px;
}
</style>
