<script setup>
import {ref} from "vue";
import Icon from "../kit/Icon.vue";
import MenuItem from "../kit/MenuItem.vue";
import MenuPanel from "../kit/MenuPanel.vue";
import Segmented from "../kit/Segmented.vue";
import TextInput from "../kit/TextInput.vue";
import ToggleItem from "../kit/ToggleItem.vue";

const props = defineProps({options: {type: Object, required: true}, filter: {type: String, default: ""}});
const emit = defineEmits(["options", "filter", "expand"]);
const anchor = ref(null);
const TOGGLES = [
    {key: "headers", label: "Headers only", icon: "file"},
    {key: "collapse", label: "Collapse big files", icon: "minimize"},
    {key: "editsOnly", label: "Hide unchanged lines", icon: "edits"},
    {key: "removals", label: "Show removals", icon: "x"},
    {key: "flush", label: "Flush", icon: "list"},
    {key: "columns", label: "Always two columns", icon: "columns"},
    {key: "capped", label: "Limit card height", icon: "layout"},
];
const SIZES = [-1, 0, 1];
const LINES = [
    {key: "0", label: "All"},
    {key: "5", label: "5"},
    {key: "10", label: "10"},
    {key: "20", label: "20"},
];

const set = (patch) => emit("options", {...props.options, ...patch});
const sized = (by) => set({size: Math.max(SIZES[0], Math.min(SIZES[SIZES.length - 1], props.options.size + by))});
const toggle = (e) => (anchor.value = anchor.value ? null : e.currentTarget);

function expand() {
    anchor.value = null;
    emit("expand");
}
</script>

<template>
    <div class="feed-bar">
        <span class="feed-bar-search">
            <Icon name="search" :size="12" />
            <TextInput class="feed-bar-filter" :value="filter" placeholder="Filter files" @input="emit('filter', $event.target.value)" />
        </span>
        <button type="button" :class="['feed-bar-view', {open: anchor}]" :aria-expanded="!!anchor" @click="toggle">
            View
            <Icon name="caret" :size="12" />
        </button>
        <template v-if="anchor">
            <MenuPanel :anchor="anchor" :min-width="250" :max-width="300" @click.stop @close="anchor = null">
                <template v-for="t in TOGGLES" :key="t.key">
                    <ToggleItem :on="!!options[t.key]" :icon="t.icon" @click="set({[t.key]: !options[t.key]})">{{ t.label }}</ToggleItem>
                </template>
                <span class="feed-bar-line" />
                <MenuItem @click="expand">
                    <Icon name="rows" :size="14" />
                    Expand everything
                </MenuItem>
                <MenuItem :disabled="options.size <= SIZES[0]" @click="sized(-1)">
                    <Icon name="narrow" :size="14" />
                    Smaller text
                </MenuItem>
                <MenuItem :disabled="options.size >= SIZES[SIZES.length - 1]" @click="sized(1)">
                    <Icon name="wide" :size="14" />
                    Larger text
                </MenuItem>
                <div class="feed-bar-lines">
                    <Icon name="chapters" :size="14" />
                    <span>Lines</span>
                    <Segmented :options="LINES" :value="String(options.lines || 0)" @pick="(key) => set({lines: Number(key)})" />
                </div>
            </MenuPanel>
        </template>
    </div>
</template>

<style scoped>
.feed-bar-lines .segmented {
    margin-left: auto;
}

.feed-bar-lines {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 4px 8px;
    color: var(--text-2);
    font-size: 13px;
    white-space: nowrap;
}

.feed-bar {
    flex: none;
    display: flex;
    align-items: center;
    gap: 8px;
    height: 34px;
    padding: 0 10px 0 14px;
    border-bottom: 1px solid var(--border);
}

.feed-bar-search {
    display: flex;
    flex: 1;
    align-items: center;
    gap: 6px;
    min-width: 0;
    color: var(--text-4);
}

.feed-bar-search .feed-bar-filter {
    flex: 1;
    padding: 3px 0;
    border: 0;
    background: none;
    font-size: 12px;
}

.feed-bar-view {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 3px 6px 3px 8px;
    border: 0;
    border-radius: 6px;
    background: none;
    color: var(--text-3);
    font: inherit;
    font-size: 12px;
    cursor: pointer;
}

.feed-bar-view:hover,
.feed-bar-view.open {
    background: var(--hover);
    color: var(--text);
}

.feed-bar-line {
    height: 1px;
    margin: 4px 2px;
    background: var(--border);
}
</style>
