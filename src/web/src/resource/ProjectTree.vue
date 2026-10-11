<script setup>
import Icon from "../kit/Icon.vue";
import {ref} from "vue";
import {api} from "../api/client.js";

const props = defineProps({folder: {type: String, default: ""}, open: {type: String, default: ""}, depth: {type: Number, default: 0}});
const emit = defineEmits(["pick"]);

const entries = ref(null);
const failure = ref("");
const opened = ref(new Set());

async function read() {
    try {
        entries.value = await api.projectFiles(props.folder);
    } catch (e) {
        failure.value = e.message;
    }
}

function toggle(entry) {
    const shown = new Set(opened.value);
    shown.has(entry.path) ? shown.delete(entry.path) : shown.add(entry.path);
    opened.value = shown;
}

read();
</script>

<template>
    <ul class="tree" :style="{'--depth': depth}">
        <template v-if="failure">
            <li class="tree-failure">{{ failure }}</li>
        </template>
        <template v-for="entry in entries || []" :key="entry.path">
            <li>
                <template v-if="entry.folder">
                    <button type="button" class="tree-row" :aria-expanded="opened.has(entry.path)" @click="toggle(entry)">
                        <Icon :name="opened.has(entry.path) ? 'caret' : 'chevronRight'" :size="12" />
                        <span class="tree-name">{{ entry.name }}</span>
                    </button>
                    <template v-if="opened.has(entry.path)">
                        <ProjectTree :folder="entry.path" :open="open" :depth="depth + 1" @pick="(picked) => emit('pick', picked)" />
                    </template>
                </template>
                <template v-else>
                    <button type="button" :class="['tree-row', 'tree-file', {open: entry.path === open}]" @click="emit('pick', entry)">
                        <Icon name="file" :size="12" />
                        <span class="tree-name">{{ entry.name }}</span>
                    </button>
                </template>
            </li>
        </template>
    </ul>
</template>

<style scoped>
.tree {
    list-style: none;
    margin: 0;
    padding: 0;
}

.tree-row {
    display: flex;
    align-items: center;
    gap: 6px;
    width: 100%;
    padding: 3px 8px 3px calc(8px + var(--depth) * 12px);
    border: 0;
    border-radius: 5px;
    background: none;
    color: inherit;
    font: inherit;
    font-size: 12.5px;
    text-align: left;
    cursor: pointer;
}

.tree-row:hover {
    background: var(--hover, rgba(127, 127, 127, 0.12));
}

.tree-row.open {
    background: var(--selected, rgba(127, 127, 127, 0.2));
    font-weight: 600;
}

.tree-name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.tree-failure {
    padding: 6px 8px;
    color: var(--muted, #888);
    font-size: 12.5px;
}
</style>
