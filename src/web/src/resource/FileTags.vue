<script setup>
import {ref} from "vue";
import {api} from "../api/client.js";
import {route} from "../route.js";

const props = defineProps({file: {type: Object, required: true}, lines: {type: Number, default: 1}});
const editing = ref(false);
const draft = ref("");

function edit() {
    draft.value = props.file.description || "";
    editing.value = true;
}

function cancel() {
    editing.value = false;
}

async function save() {
    const tags = draft.value.trim();
    editing.value = false;
    if (tags !== props.file.description) {
        await api.act(props.file.type, props.file.n, "tag", {name: props.file.name, tags});
        props.file.description = tags;
    }
}
</script>

<template>
    <template v-if="editing">
        <input
            v-model="draft"
            class="editor"
            aria-label="File tags"
            autofocus
            @blur="save"
            @keydown.enter.prevent="save"
            @keydown.esc.prevent="cancel"
        />
    </template>
    <template v-else>
        <button
            type="button"
            :class="['tags', {empty: !file.description, clamped: lines > 1}]"
            :style="{'--lines': lines}"
            :title="file.description ? 'Click to change the description' : ''"
            @click="edit"
        >
            {{ file.description || "Add a description" }}
        </button>
    </template>
</template>

<style scoped>
.tags,
.editor {
    display: block;
    width: 100%;
    min-width: 0;
    padding: 0;
    border: 0;
    background: none;
    color: var(--text-2);
    font: inherit;
    text-align: left;
}

.tags {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: text;
}

.tags.clamped {
    display: -webkit-box;
    white-space: normal;
    -webkit-line-clamp: var(--lines);
    -webkit-box-orient: vertical;
}

.tags.empty {
    color: var(--text-3);
}

.editor {
    outline: none;
    box-shadow: 0 1px 0 var(--accent-text);
}
</style>
